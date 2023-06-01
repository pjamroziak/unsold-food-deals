import { Module } from '@nestjs/common';
import { FoodsiClient } from './foodsi.client';
import { AuthService, RestaurantService } from './services';
import { ConfigurableModuleClass } from './foodsi-client.module-definition';

@Module({
  providers: [FoodsiClient, RestaurantService, AuthService],
  exports: [FoodsiClient],
})
export class FoodsiClientModule extends ConfigurableModuleClass {}
