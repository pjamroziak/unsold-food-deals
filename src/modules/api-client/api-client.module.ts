import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './api-client.module-definition';
import { ApiClient } from './api.client';

@Module({
  providers: [ApiClient],
  exports: [ApiClient],
})
export class ApiClientModule extends ConfigurableModuleClass {}
