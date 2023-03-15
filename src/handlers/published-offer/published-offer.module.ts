import {
  apiClientConfig,
  ApiClientConfig,
} from '@app/configs/api-client.config';
import { ApiClientModule } from '@app/modules/api-client/api-client.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublishedOfferEvent } from './published-offer.event';

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
  ],
  providers: [PublishedOfferEvent],
})
export class PublishedOfferModule {}
