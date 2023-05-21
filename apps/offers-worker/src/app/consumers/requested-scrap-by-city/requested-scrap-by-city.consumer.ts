import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { RequestedScrapByCityService } from './requested-scrap-by-city.service';
import { CitySchema, IdSchema } from '@unsold-food-deals/schemas';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Processor('requested-scrap-by-city')
export class RequestedScrapByCityConsumer extends WorkerHost {
  private readonly logger = new Logger(RequestedScrapByCityConsumer.name);

  constructor(
    @InjectQueue('created-offer')
    private readonly offersQueue: Queue,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly service: RequestedScrapByCityService
  ) {
    super();
  }

  async process(job: Job) {
    const city = IdSchema.merge(CitySchema).parse(job.data);
    const offers = await this.service.getOffers(city);

    for (const offer of offers) {
      const isExist = await this.cacheManager.get(offer.id);
      if (isExist === null) {
        await this.offersQueue.add('created-offer', offer, {
          removeOnComplete: true,
          removeOnFail: true,
        });
        this.cacheManager.set(offer.id, offer);
      }
    }
  }

  @OnWorkerEvent('active')
  onActive() {
    this.logger.log('started processing "requested-scrap-by-city" event');
  }

  @OnWorkerEvent('failed')
  onFailed(job, error) {
    this.logger.error(
      { error },
      'failed processing "requested-scrap-by-city" event'
    );
  }

  @OnWorkerEvent('error')
  onError(job, error) {
    this.logger.error({ error });
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    this.logger.log('finished processing "requested-scrap-by-city" event');
  }
}
