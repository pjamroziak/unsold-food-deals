import { Injectable, Logger } from '@nestjs/common';
import { IAppStrategy } from './app-strategy.interface';
import {
  City,
  Cordinates,
  Offer,
  Restaurant,
  RestaurantPage,
  SupportedApp,
} from '@unsold-food-deals/schemas';
import {
  FoodsiClient,
  RestaurantRequest,
} from '@unsold-food-deals/foodsi-client';
import { DateTime } from 'luxon';

const FIRST_PAGE_INDEX = 1;

@Injectable()
export class FoodsiAppStrategy implements IAppStrategy {
  private readonly logger = new Logger(FoodsiAppStrategy.name);

  constructor(private readonly foodsiClient: FoodsiClient) {}

  async execute(city: City): Promise<Offer[]> {
    const restaurants = await this.getRestaurants(city);

    const offers: Offer[] = restaurants.map((restaurant) => ({
      id: `${SupportedApp.Foodsi}:${restaurant.id}:${restaurant.package_id}`,
      cityId: city.id,
      app: SupportedApp.Foodsi,
      name: restaurant.name,
      stock: restaurant.package_day.meals_left,
      oldPrice: Number(restaurant.meal.original_price),
      newPrice: Number(restaurant.meal.price),
      openedAt: this.parseDate(
        restaurant.package_day.collection_day.opened_at,
        restaurant.package_day.collection_day.week_day
      ),
      closedAt: this.parseDate(
        restaurant.package_day.collection_day.closed_at,
        restaurant.package_day.collection_day.week_day
      ),
    }));

    return offers;
  }

  private async getRestaurants(city: City) {
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
        offers: restaurants.length,
      },
      `completed scrapping Foodsi`
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

  private parseDate(offerDateIso: string, weekday: number) {
    const baseDate = DateTime.now();
    const offerDate = DateTime.fromISO(offerDateIso);

    return baseDate
      .set({
        weekday,
        hour: offerDate.hour,
        minute: offerDate.minute,
      })
      .toUTC()
      .toISO();
  }
}
