import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CreatedOfferConsumer } from './created-offer.consumer';
import { CreatedOfferService } from './created-offer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'created-offer',
    }),
    BullModule.registerQueue({
      name: 'send-message',
    }),
  ],
  providers: [CreatedOfferConsumer, CreatedOfferService],
})
export class CreatedOfferModule {}
