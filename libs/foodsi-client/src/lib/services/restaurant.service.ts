import { Logger } from '@nestjs/common';
import axios, { Axios } from 'axios';
import { RestaurantRequest } from '../types';
import { RestaurantPageSchema } from '@unsold-food-deals/schemas';

export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name);
  private readonly http: Axios;

  constructor() {
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
    this.logger.log('Fetching Foodsi restaurants');

    const response = await this.http.post('api/v2/restaurants', search);

    return RestaurantPageSchema.parse(response.data);
  }
}
