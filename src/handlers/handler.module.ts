import { rabbitmqConfig } from '@app/configs/rabbitmq.config';
import { RabbitMQModule, RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreatedNewOfferModule } from './created-new-offer/created-new-offer.module';

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
    CreatedNewOfferModule,
  ],
})
export class HandlerModule {}
