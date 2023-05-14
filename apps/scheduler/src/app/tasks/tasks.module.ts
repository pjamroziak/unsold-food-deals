import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { RequestScrapByCityTask } from './request-scrap-by-city.task';
import { ApiConfig } from '../app.config';
import { ApiClientModule } from '@unsold-food-deals/api-client';

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
      name: 'requested-scrap-by-city',
    }),
    ApiClientModule.registerAsync(apiClientFactory),
  ],
  providers: [RequestScrapByCityTask],
})
export class TasksModule {}
