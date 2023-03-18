import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ApiModule } from './api/api.module';
import { BotModule } from './bot/bot.module';
import { HandlerModule } from './handlers/handler.module';

@Module({
  imports: [LoggerModule.forRoot(), ApiModule, BotModule, HandlerModule],
})
export class AppModule {}
