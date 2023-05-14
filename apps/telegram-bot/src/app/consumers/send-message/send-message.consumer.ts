import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Job } from 'bullmq';
import { MessageSchema } from '@unsold-food-deals/schemas';
import { DefaultParseMode } from '../../constants';

@Processor('send-message')
export class SendMessageConsumer extends WorkerHost {
  private readonly logger = new Logger(SendMessageConsumer.name);
  private readonly bot: Telegraf;

  constructor(@InjectBot() bot: Telegraf) {
    super();
    this.bot = bot;
  }

  async process(job: Job) {
    const message = MessageSchema.parse(job.data);

    await this.bot.telegram.sendMessage(
      message.chatId,
      message.payload,
      DefaultParseMode
    );
  }

  @OnWorkerEvent('active')
  onActive() {
    this.logger.debug('Started processing "send-message" event');
  }

  @OnWorkerEvent('failed')
  onFailed(job, error) {
    this.logger.error('Failed processing "send-message" job', { error });
  }

  @OnWorkerEvent('error')
  onError(job, error) {
    this.logger.error(error);
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    this.logger.debug('Finished processing "send-message" event');
  }
}
