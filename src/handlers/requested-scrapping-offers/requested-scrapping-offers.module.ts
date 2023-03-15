import {
  apiClientConfig,
  ApiClientConfig,
} from '@app/configs/api-client.config';
import { ApiClientModule } from '@app/modules/api-client/api-client.module';
import { EventPublisherModule } from '@app/services/event-publisher/event-publisher.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestedScrappingOffersEvent } from './requested-scrapping-offers.event';

@Module({
  imports: [
    ApiClientModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          load: [apiClientConfig],
        }),
      ],
      useFactory: (config: ApiClientConfig) => ({
        ...config,
      }),
      inject: [apiClientConfig.KEY],
    }),
    EventPublisherModule,
  ],
  providers: [RequestedScrappingOffersEvent],
})
export class RequestedScrappingOffersModule {}
