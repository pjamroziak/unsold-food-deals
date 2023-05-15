import { Module } from '@nestjs/common';
import { Redis } from '@telegraf/session/redis';
import path from 'path';
import { session } from 'telegraf';
import { I18n } from 'telegraf-fluent';
import { TelegrafModule } from 'nestjs-telegraf';
import { ApiClientModule } from '@unsold-food-deals/api-client';
import { CoreUpdate } from './updates/core.update';
import { SetupWizard } from './wizards/setup.wizard';
import { BullModule } from '@nestjs/bullmq';
import { SendMessageConsumerModule } from './consumers/send-message/send-message.module';
import {
  ApiConfig,
  LoggerConfig,
  RedisConfig,
  RootConfig,
  TelegramConfig,
} from './app.config';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { LoggerModule, LoggerModuleAsyncParams } from 'nestjs-pino';

const telegrafFactory = {
  inject: [TelegramConfig, RedisConfig],
  useFactory: (telegramConfig: TelegramConfig, redisConfig: RedisConfig) => ({
    token: telegramConfig.token,
    middlewares: [
      new I18n({
        locales: 'pl',
        directory: path.resolve(__dirname, 'assets'),
      }).middleware(),
      session({
        store: Redis<object>({
          url: `redis://${redisConfig.host}:${redisConfig.port}`,
        }),
      }),
    ],
  }),
};

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
        name: 'grafanacloud-pjamroziak-logs',
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
    TelegrafModule.forRootAsync(telegrafFactory),
    BullModule.forRootAsync(bullmqFactory),
    ApiClientModule.registerAsync(apiClientFactory),
    SendMessageConsumerModule,
  ],
  providers: [CoreUpdate, SetupWizard],
})
export class AppModule {}
