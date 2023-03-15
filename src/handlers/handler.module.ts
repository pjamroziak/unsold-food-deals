import { rabbitmqConfig } from '@app/configs/rabbitmq.config';
import { RabbitMQModule, RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestedScrappingOffersModule } from './requested-scrapping-offers/requested-scrapping-offers.module';
import { PublishedOfferModule } from './published-offer/published-offer.module';
import { PublishedCityToScrapModule } from './published-city-to-scrap/published-city-to-scrap.module';

@Module({
  imports: [
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
    PublishedOfferModule,
    PublishedCityToScrapModule,
    RequestedScrappingOffersModule,
  ],
})
export class HandlerModule {}
