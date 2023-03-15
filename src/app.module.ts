import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { BotModule } from './bot/bot.module';
import { HandlerModule } from './handlers/handler.module';

@Module({
  imports: [ApiModule, BotModule, HandlerModule],
})
export class AppModule {}
