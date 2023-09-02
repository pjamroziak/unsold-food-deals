import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { RedisConfig, TelegramConfig } from '../app.config';
import { I18n } from 'telegraf-fluent';
import path from 'path';
import { session } from 'telegraf';
import { Redis } from '@telegraf/session/redis';
import { SendMessageConsumerModule } from './consumers/send-message/send-message.module';
import { CoreUpdate } from './updates/core.update';
import { SetCityWizard } from './wizards/setcity.wizard';
import { SetFiltersWizard } from './wizards/setfilters.wizard';

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
    TelegrafModule.forRootAsync(telegrafFactory),
    SendMessageConsumerModule,
  ],
  providers: [CoreUpdate, SetCityWizard, SetFiltersWizard],
})
export class TelegramBotModule {}
