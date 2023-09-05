import { BullModule } from '@nestjs/bullmq';
import { ConfigurableModuleAsyncOptions, Module } from '@nestjs/common';
import { RequestScrapByCityTask } from './request-scrap-by-city.task';
import { ApiConfig } from '../app.config';
import {
  ApiClientModule,
  ApiClientOptions,
} from '@unsold-food-deals/api-client';

const apiClientFactory: ConfigurableModuleAsyncOptions<ApiClientOptions> = {
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
    ApiClientModule.forRootAsync(apiClientFactory),
  ],
  providers: [RequestScrapByCityTask],
})
export class TasksModule {}
