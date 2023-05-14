import { Injectable } from '@nestjs/common';
import { ApiCityService, ApiClientService, ApiUserService } from './services';

@Injectable()
export class ApiClient {
  constructor(
    readonly city: ApiCityService,
    readonly client: ApiClientService,
    readonly user: ApiUserService
  ) {}
}
