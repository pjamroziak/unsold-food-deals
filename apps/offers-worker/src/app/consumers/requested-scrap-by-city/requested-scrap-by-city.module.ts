import { Module } from '@nestjs/common';
import { RequestedScrapByCityConsumer } from './requested-scrap-by-city.consumer';
import { RequestedScrapByCityService } from './requested-scrap-by-city.service';
import { BullModule } from '@nestjs/bullmq';
import { FoodsiClientModule } from '@unsold-food-deals/foodsi-client';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'requested-scrap-by-city',
    }),
    BullModule.registerQueue({
      name: 'created-offer',
    }),
    FoodsiClientModule,
  ],
  providers: [RequestedScrapByCityConsumer, RequestedScrapByCityService],
})
export class RequestedScrapByCityModule {}
