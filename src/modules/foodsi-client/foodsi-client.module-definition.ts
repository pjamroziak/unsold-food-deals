import { ConfigurableModuleBuilder } from '@nestjs/common';
import { FoodsiClientOptions } from './foodsi-client-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<FoodsiClientOptions>().build();
