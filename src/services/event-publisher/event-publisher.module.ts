import { rabbitmqConfig } from '@app/configs/rabbitmq.config';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq/lib/rabbitmq.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventPublisher } from './event-publisher.service';

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
  ],
  providers: [EventPublisher],
  exports: [EventPublisher],
})
export class EventPublisherModule {}
