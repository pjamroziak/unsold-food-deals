import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { RequestedScrapByCityService } from './requested-scrap-by-city.service';
import { IdSchema } from '@unsold-food-deals/schemas';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ApiClient } from '@unsold-food-deals/api-client';

@Processor('requested-scrap-by-city')
export class RequestedScrapByCityConsumer extends WorkerHost {
  private readonly logger = new Logger(RequestedScrapByCityConsumer.name);

  constructor(
    @InjectQueue('created-offer')
    private readonly offersQueue: Queue,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly service: RequestedScrapByCityService,
    private readonly apiClient: ApiClient
  ) {
    super();
  }

  async process(job: Job) {
    const { id } = IdSchema.parse(job.data);
    const response = await this.apiClient.city.find({ id });

    if (response.count === 0) {
      throw new Error(`Cannot find City by id - ${id}`);
    }

    const city = response.results[0];
    const offers = await this.service.getOffers(city);

    const promises = offers.map(async (offer) => {
      const isExist = await this.cacheManager.get(offer.id);
      if (isExist === null) {
        await this.offersQueue.add('created-offer', offer, {
          removeOnComplete: true,
          removeOnFail: true,
        });
      }
      await this.cacheManager.set(offer.id, offer);
    });

    const results = await Promise.allSettled(promises);
    results
      .filter((result) => result.status === 'rejected')
      .forEach((result) =>
        this.logger.error(
          (result as PromiseRejectedResult).reason,
          'failed processing offer'
        )
      );
  }

  @OnWorkerEvent('failed')
  onFailed(job, error) {
    this.logger.error(
      error,
      'failed processing "requested-scrap-by-city" event'
    );
  }

  @OnWorkerEvent('error')
  onError(job, error) {
    this.logger.error({ error });
  }
}
