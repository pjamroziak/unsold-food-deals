import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { BotModule } from './bot/bot.module';
import { HandlerModule } from './handlers/handler.module';
import { TaskModule } from './tasks/tasks.module';

@Module({
  imports: [ApiModule, TaskModule, BotModule, HandlerModule],
})
export class AppModule {}
