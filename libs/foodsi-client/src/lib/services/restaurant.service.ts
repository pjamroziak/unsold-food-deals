import { Logger } from '@nestjs/common';
import axios, { Axios } from 'axios';
import { RestaurantRequest } from '../types';
import { RestaurantPageSchema } from '@unsold-food-deals/schemas';
import { AuthService } from './auth.service';

export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name);
  private readonly http: Axios;

  constructor(private readonly authService: AuthService) {
    this.http = axios.create({
      baseURL: 'https://api.foodsi.pl',
      headers: {
        'Content-type': 'application/json',
        'system-version': 'android_3.0.0',
        'user-agent': 'okhttp/3.12.0',
      },
    });
  }

  async find(search: RestaurantRequest) {
    const authHeaders = await this.authService.getAuthorizedHeaders();
    const response = await this.http.post('api/v2/restaurants', search, {
      headers: authHeaders,
    });

    return RestaurantPageSchema.parse(response.data);
  }
}
