import {
  apiClientConfig,
  ApiClientConfig,
} from '@app/configs/api-client.config';
import {
  foodsiClientConfig,
  FoodsiClientConfig,
} from '@app/configs/foodsi-client.config';
import { FoodsiClientModule } from '@app/modules';
import { ApiClientModule } from '@app/modules/api-client/api-client.module';
import { EventPublisherModule } from '@app/services/event-publisher/event-publisher.module';
import { RedisServiceModule } from '@app/services/redis/redis.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublishedCityToScrapEvent } from './published-city-to-scrap.event';
import { PublishedCityToScrapService } from './published-city-to-scrap.service';

@Module({
  imports: [
    FoodsiClientModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          load: [foodsiClientConfig],
        }),
      ],
      useFactory: (config: FoodsiClientConfig) => ({
        ...config,
      }),
      inject: [foodsiClientConfig.KEY],
    }),
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
    RedisServiceModule,
  ],
  providers: [PublishedCityToScrapEvent, PublishedCityToScrapService],
})
export class PublishedCityToScrapModule {}
