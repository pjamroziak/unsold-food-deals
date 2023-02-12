import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ApiClientOptions } from './api-client-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ApiClientOptions>().build();
