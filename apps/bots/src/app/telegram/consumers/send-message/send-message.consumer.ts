import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Job } from 'bullmq';
import { MessageSchema } from '@unsold-food-deals/schemas';
import { DefaultParseMode } from '../../constants';
import { ApiClient } from '@unsold-food-deals/api-client';

type SendMessageTelegrafError = {
  response: {
    error_code: number;
  };
  on: {
    payload: {
      chat_id: string;
    };
  };
};

@Processor('send-message')
export class SendMessageConsumer extends WorkerHost {
  private readonly logger = new Logger(SendMessageConsumer.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
    private readonly apiClient: ApiClient
  ) {
    super();
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
    this.logger.log('started processing "send-message" event');
  }

  @OnWorkerEvent('failed')
  async onFailed(job, error) {
    this.logger.error({ error }, 'failed processing "send-message" job');
    if (error?.response?.error_code === 403) {
      const casted = error as SendMessageTelegrafError;

      const { results } = await this.apiClient.client.find({
        chatId: casted.on.payload.chat_id,
      });

      if (results.length > 0) {
        const client = results[0];
        await this.apiClient.client.update(client.id, { enabled: false });
      }
    }
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
