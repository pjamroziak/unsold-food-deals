import { Module } from '@nestjs/common';
import { LoggerConfig, RedisConfig, RootConfig } from './app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { BullModule } from '@nestjs/bullmq';
import { TasksModule } from './tasks/tasks.module';
import { LoggerModule, LoggerModuleAsyncParams } from 'nestjs-pino';

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

const loggerFactory: LoggerModuleAsyncParams = {
  inject: [LoggerConfig],
  useFactory: (config: LoggerConfig) => {
    return {
      pinoHttp: {
        name: 'grafanacloud-scheduler',
        level: 'info',
        transport: {
          target: 'pino-loki',
          options: {
            silenceErrors: false,
            host: config.host,
            basicAuth: {
              username: config.username,
              password: config.password,
            },
          },
        },
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
    LoggerModule.forRootAsync(loggerFactory),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync(bullmqFactory),
    TasksModule,
  ],
})
export class AppModule {}
