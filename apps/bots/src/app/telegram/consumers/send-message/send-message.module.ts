import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { SendMessageConsumer } from './send-message.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-message',
    }),
  ],
  providers: [SendMessageConsumer],
})
export class SendMessageConsumerModule {}
