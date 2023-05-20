import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { OfferSchema } from '@unsold-food-deals/schemas';
import { Job } from 'bullmq';
import { CreatedOfferService } from './created-offer.service';

@Processor('created-offer')
export class CreatedOfferConsumer extends WorkerHost {
  private readonly logger = new Logger(CreatedOfferConsumer.name);

  constructor(private readonly service: CreatedOfferService) {
    super();
  }

  async process(job: Job) {
    const offer = OfferSchema.parse(job.data);
    const payload = this.service.parseOfferToMessagePayload(offer);

    await this.service.sendMessagesToClients(offer.cityId, payload);
  }

  @OnWorkerEvent('active')
  onActive() {
    this.logger.debug('Started processing "created-offer" job');
  }

  @OnWorkerEvent('failed')
  onFailed(job, error) {
    this.logger.error({ error }, 'Failed processing "created-offer" job');
  }

  @OnWorkerEvent('error')
  onError(job, error) {
    this.logger.error({ error });
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    this.logger.debug('Finished processing "created-offer" job');
  }
}
