import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FoodsiScrapperModule } from './foodsi-scrapper/foodsi-scrapper.module';

@Module({
  imports: [ScheduleModule.forRoot(), FoodsiScrapperModule],
})
export class TaskModule {}
