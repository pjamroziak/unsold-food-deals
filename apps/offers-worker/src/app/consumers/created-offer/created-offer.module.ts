import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CreatedOfferConsumer } from './created-offer.consumer';
import { CreatedOfferService } from './created-offer.service';
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
      name: 'created-offer',
    }),
    BullModule.registerQueue({
      name: 'send-message',
    }),
    ApiClientModule.registerAsync(apiClientFactory),
  ],
  providers: [CreatedOfferConsumer, CreatedOfferService],
})
export class CreatedOfferModule {}
