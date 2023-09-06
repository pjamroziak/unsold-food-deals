import { Module } from '@nestjs/common';
import { ApiClientModule } from '@unsold-food-deals/api-client';
import { BullModule } from '@nestjs/bullmq';
import {
  ApiConfig,
  DiscordConfig,
  LoggerConfig,
  RedisConfig,
  RootConfig,
  TelegramConfig,
} from './app.config';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { LoggerModule, LoggerModuleAsyncParams } from 'nestjs-pino';
import { TelegramBotModule } from './telegram/telegram.module';
import { DiscordBotModule } from './discord/discord.module';
import { DiscordModuleAsyncOptions, DiscordModule } from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';
import { Redis } from '@telegraf/session/redis';
import { TelegrafModule } from 'nestjs-telegraf';
import path from 'path';
import { session } from 'telegraf';
import { I18n } from 'telegraf-fluent';
import {
  getPinoLokiTransport,
  getPinoPrettyTransport,
  isProduction,
} from '@unsold-food-deals/utils';

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
        name: 'grafanacloud-bots',
        level: 'info',
        transport: isProduction()
          ? getPinoLokiTransport(config)
          : getPinoPrettyTransport(),
      },
    };
  },
};

const discordFactory: DiscordModuleAsyncOptions = {
  inject: [DiscordConfig],
  useFactory: (config: DiscordConfig) => ({
    token: config.token,
    discordClientOptions: {
      intents: [GatewayIntentBits.Guilds],
    },
    autoLogin: true,
  }),
};

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
    DiscordModule.forRootAsync(discordFactory),
    TelegrafModule.forRootAsync(telegrafFactory),

    TelegramBotModule,
    DiscordBotModule,
  ],
})
export class AppModule {}
