import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { SendMessageConsumer } from './send-message.consumer';
import { DiscordModule } from '@discord-nestjs/core';
import { SendMessageService } from './send-message.service';
import { strategies } from './strategies';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-message',
    }),
    DiscordModule.forFeature(),
  ],
  providers: [SendMessageConsumer, SendMessageService, ...strategies],
})
export class SendMessageConsumerModule {}
