import {
  ApiClientConfig,
  apiClientConfig,
} from '@app/configs/api-client.config';
import {
  FoodsiClientConfig,
  foodsiClientConfig,
} from '@app/configs/foodsi-client.config';
import { rabbitmqConfig } from '@app/configs/rabbitmq.config';
import { FoodsiClientModule } from '@app/modules';
import { ApiClientModule } from '@app/modules/api-client/api-client.module';
import { OfferModule } from '@app/services/offers/offer.module';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FoodsiScrapperService } from './foodsi-scrapper.service';
import { FoodsiScrapperTask } from './foodsi-scrapper.task';

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
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [
        ConfigModule.forRoot({
          load: [rabbitmqConfig],
        }),
      ],
      useFactory: (config: RabbitMQConfig) => ({
        ...config,
        connectionInitOptions: { wait: false },
      }),
      inject: [rabbitmqConfig.KEY],
    }),
    OfferModule,
  ],
  providers: [FoodsiScrapperTask, FoodsiScrapperService],
})
export class FoodsiScrapperModule {}
