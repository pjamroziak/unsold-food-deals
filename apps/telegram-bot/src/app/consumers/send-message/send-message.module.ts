import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { SendMessageConsumer } from './send-message.consumer';
import { ApiClientModule } from '@unsold-food-deals/api-client';
import { ApiConfig } from '../../app.config';

const apiClientFactory = {
  inject: [ApiConfig],
  useFactory: (config: ApiConfig) => {
    return {
      baseUrl: config.url,
    };
  },
};

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-message',
    }),
    ApiClientModule.registerAsync(apiClientFactory),
  ],
  providers: [SendMessageConsumer],
})
export class SendMessageConsumerModule {}
