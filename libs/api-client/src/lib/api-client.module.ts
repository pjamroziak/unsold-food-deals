import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './api-client.module-definition';
import { ApiClient } from './api.client';
import { ApiCityService, ApiClientService, ApiUserService } from './services';

@Module({
  providers: [ApiClient, ApiClientService, ApiUserService, ApiCityService],
  exports: [ApiClient],
})
export class ApiClientModule extends ConfigurableModuleClass {}
