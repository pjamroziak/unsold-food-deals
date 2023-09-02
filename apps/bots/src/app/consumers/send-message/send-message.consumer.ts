import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OfferSchema } from '@unsold-food-deals/schemas';
import { SendMessageService } from './send-message.service';

@Processor('send-message')
export class SendMessageConsumer extends WorkerHost {
  private readonly logger = new Logger(SendMessageConsumer.name);

  constructor(private readonly service: SendMessageService) {
    super();
  }

  async process(job: Job) {
    const offer = OfferSchema.parse(job.data);
    await this.service.send(offer);
  }

  @OnWorkerEvent('active')
  onActive() {
    this.logger.log('started processing "send-message" event');
  }

  @OnWorkerEvent('failed')
  async onFailed(job, error) {
    this.logger.error({ error }, 'failed processing "send-message" job');
  }

  @OnWorkerEvent('error')
  onError(job, error) {
    this.logger.error({ error });
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    this.logger.log('finished processing "send-message" event');
  }
}
