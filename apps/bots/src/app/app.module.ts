import { Module } from '@nestjs/common';
import { ApiClientModule } from '@unsold-food-deals/api-client';
import { BullModule } from '@nestjs/bullmq';
import { ApiConfig, LoggerConfig, RedisConfig, RootConfig } from './app.config';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { LoggerModule, LoggerModuleAsyncParams } from 'nestjs-pino';
import { TelegramBotModule } from './telegram/telegram.module';

const apiClientFactory = {
  inject: [ApiConfig],
  useFactory: (config: ApiConfig) => {
    return {
      baseUrl: config.url,
    };
  },
};

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
        name: 'grafanacloud-telegram-bot',
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
    BullModule.forRootAsync(bullmqFactory),
    ApiClientModule.forRootAsync(apiClientFactory),
    TelegramBotModule,
  ],
})
export class AppModule {}
