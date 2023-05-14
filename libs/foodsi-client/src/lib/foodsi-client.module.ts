import { Module } from '@nestjs/common';
import { FoodsiClient } from './foodsi.client';
import { RestaurantService } from './services';

@Module({
  providers: [FoodsiClient, RestaurantService],
  exports: [FoodsiClient],
})
export class FoodsiClientModule {}
