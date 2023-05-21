import { Injectable, Logger } from '@nestjs/common';
import {
  FoodsiClient,
  RestaurantRequest,
} from '@unsold-food-deals/foodsi-client';
import {
  City,
  Cordinates,
  Offer,
  Restaurant,
  RestaurantPage,
} from '@unsold-food-deals/schemas';
import { DateTime } from 'luxon';

const FIRST_PAGE_INDEX = 1;

@Injectable()
export class RequestedScrapByCityService {
  private readonly logger = new Logger(RequestedScrapByCityService.name);

  constructor(private readonly foodsiClient: FoodsiClient) {}

  async getOffers(city: City) {
    const restaurants = await this.fetchRestaurants(city);
    const offers: Offer[] = restaurants.map((restaurant) => ({
      id: `foodsi:${restaurant.id}:${restaurant.package_id}`,
      cityId: city.id,
      name: restaurant.name,
      stock: restaurant.package_day.meals_left ?? 0,
      oldPrice: Number(restaurant.meal.original_price),
      newPrice: Number(restaurant.meal.price),
      openedAt: this.parseDate(restaurant.package_day.collection_day.opened_at),
      closedAt: this.parseDate(restaurant.package_day.collection_day.closed_at),
    }));

    return offers;
  }

  private async fetchRestaurants(city: City) {
    const restaurants: Restaurant[] = [];

    const pageIndex = FIRST_PAGE_INDEX;
    let page: RestaurantPage;

    const request = this.createRestaurantRequest(
      pageIndex,
      {
        latitude: city.latitude,
        longitude: city.longitude,
      },
      city.radiusInKm
    );

    do {
      page = await this.foodsiClient.restaurants.find(request);
      restaurants.push(...page.data);
      request.page += 1;
    } while (page.total_pages > page.current_page);

    this.logger.log(
      {
        city: city.name,
        restaurantsCount: restaurants.length,
      },
      `completed scrapping Foodsi restaurants`
    );

    return restaurants;
  }

  private createRestaurantRequest(
    page: number,
    cordinates: Cordinates,
    radius: number
  ): RestaurantRequest {
    return {
      page,
      per_page: 500,
      distance: {
        lat: cordinates.latitude,
        lng: cordinates.longitude,
        range: radius * 1000,
      },
      hide_unavailable: true,
      food_type: [],
      collection_time: {
        from: '00:00:00',
        to: '23:59:59',
      },
    };
  }

  private parseDate(dateToUpdateIso: string) {
    const baseDate = DateTime.now();
    const dateToUpdate = DateTime.fromISO(dateToUpdateIso);

    return dateToUpdate
      .set({
        year: baseDate.year,
        month: baseDate.month,
        day: baseDate.day,
      })
      .toUTC()
      .toISO();
  }
}
