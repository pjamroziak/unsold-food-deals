import { ConfigType, registerAs } from '@nestjs/config';

export const telegramConfig = registerAs('telegram-config', () => ({
  token: process.env.TELEGRAM_TOKEN,
}));

export type TelegramConfig = ConfigType<typeof telegramConfig>;
