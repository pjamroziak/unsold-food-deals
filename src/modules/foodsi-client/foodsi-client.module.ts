import { Module } from '@nestjs/common';
import { FoodsiClient } from './foodsi.client';
import { ConfigurableModuleClass } from './foodsi-client.module-definition';

@Module({
  providers: [FoodsiClient],
  exports: [FoodsiClient],
})
export class FoodsiClientModule extends ConfigurableModuleClass {}
