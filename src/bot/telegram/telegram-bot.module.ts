import {
  ApiClientConfig,
  apiClientConfig,
} from '@app/configs/api-client.config';
import { TelegramConfig, telegramConfig } from '@app/configs/telegram.config';
import { ApiClientModule } from '@app/modules/api-client/api-client.module';
import { I18n } from '@grammyjs/i18n';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import LocalSession from 'telegraf-session-local';
import { TelegramBotUpdate } from './telegram-bot.update';
import { TelegramFiltersWizard } from './wizards/telegram-bot-filters.wizard';
import { TelegramSetupWizard } from './wizards/telegram-setup-bot.wizard';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [telegramConfig],
        }),
      ],
      useFactory: ({ token }: TelegramConfig) => ({
        token,
        middlewares: [
          new I18n({
            defaultLocale: 'pl',
            directory: 'locales',
          }).middleware(),
          new LocalSession({ database: 'session.json' }).middleware(),
        ],
      }),
      inject: [telegramConfig.KEY],
    }),
    ApiClientModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          load: [apiClientConfig],
        }),
      ],
      useFactory: (config: ApiClientConfig) => ({
        ...config,
      }),
      inject: [apiClientConfig.KEY],
    }),
  ],
  providers: [TelegramBotUpdate, TelegramSetupWizard, TelegramFiltersWizard],
})
export class TelegramBotModule {}
