import { Module } from '@nestjs/common';
import { TelegramBotModule } from './telegram/telegram-bot.module';

@Module({
  imports: [TelegramBotModule],
})
export class BotModule {}
