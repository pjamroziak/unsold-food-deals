import { rabbitmqConfig } from '@app/configs/rabbitmq.config';
import { RabbitMQModule, RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { FoodsiScrapperModule } from './foodsi-scrapper/foodsi-scrapper.module';

@Module({
  imports: [ScheduleModule.forRoot(), FoodsiScrapperModule],
})
export class TaskModule {}
