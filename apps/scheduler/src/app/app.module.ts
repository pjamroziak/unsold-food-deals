import { Module } from '@nestjs/common';
import { RedisConfig, RootConfig } from './app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { BullModule } from '@nestjs/bullmq';
import { TasksModule } from './tasks/tasks.module';

const bullmqFactory = {
  inject: [RedisConfig],
  useFactory: (config: RedisConfig) => {
    return {
      connection: {
        host: config.host,
        port: config.port,
      },
    };
  },
};

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: dotenvLoader({
        separator: '__',
      }),
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync(bullmqFactory),
    TasksModule,
  ],
})
export class AppModule {}
