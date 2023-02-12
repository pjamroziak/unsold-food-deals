import { Cordinates } from '@app/common/types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios, { Axios } from 'axios';
import { FoodsiClientOptions } from './foodsi-client-options.interface';
import { MODULE_OPTIONS_TOKEN } from './foodsi-client.module-definition';
import {
  Restaurant,
  RestaurantPage,
  RestaurantRequest,
} from './foodsi-client.types';

@Injectable()
export class FoodsiClient {
  private readonly FIRST_PAGE_INDEX = 1;
  private readonly logger = new Logger(FoodsiClient.name);
  private readonly http: Axios;

  private readonly foodsiRadius: number = 30000;
  private readonly restaurantEndpoint: string = '';

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    options: FoodsiClientOptions,
  ) {
    this.http = axios.create({
      baseURL: options.baseUrl,
      headers: options.headers,
    });

    this.foodsiRadius = options.request.distance.range;
    this.restaurantEndpoint = options.offersEndpoint;
  }

  async fetchRestaurants(cordinates: Cordinates) {
    const restaurants: Restaurant[] = [];

    let pageIndex = this.FIRST_PAGE_INDEX;
    let page: RestaurantPage;
    do {
      const request = this.createRestaurantsRequest(pageIndex++, cordinates);
      page = await this.fetchPage(request);

      restaurants.push(...page.data);
    } while (page.total_pages > page.current_page);

    return restaurants;
  }

  private async fetchPage(request: RestaurantRequest) {
    const response = await this.http.post(this.restaurantEndpoint, request);

    return response.data;
  }

  private createRestaurantsRequest(
    page: number,
    cordinates: Cordinates,
  ): RestaurantRequest {
    return {
      page,
      per_page: 500,
      distance: {
        lat: cordinates.latitude,
        lng: cordinates.longitude,
        range: this.foodsiRadius,
      },
      hide_unavailable: true,
      food_type: [],
      collection_time: {
        from: '00:00:00',
        to: '23:59:59',
      },
    };
  }
}
