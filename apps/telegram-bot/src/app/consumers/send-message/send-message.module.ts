import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { SendMessageConsumer } from './send-message.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'messages',
    }),
  ],
  providers: [SendMessageConsumer],
})
export class SendMessageConsumerModule {}
