import { Cordinates } from '@app/common/types';
import { Restaurant } from '@app/modules';
import { FoodsiClient } from '@app/modules/foodsi-client/foodsi.client';
import { OfferMessage } from '@app/services/offers/redis.types';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class FoodsiScrapperService {
  constructor(private readonly client: FoodsiClient) {}

  async getOffers(cordinates: Cordinates) {
    const restaurants = await this.client.fetchRestaurants(cordinates);
    return this.mapRestaurantsToOffers(restaurants);
  }

  private mapRestaurantsToOffers(
    restaurants: Restaurant[],
  ): Omit<OfferMessage, 'cityId'>[] {
    return restaurants.map((restaurant) => ({
      id: `foodsi:${restaurant.id}:${restaurant.package_id}`,
      name: restaurant.name,
      stock: restaurant.package_day.meals_left ?? 0,
      oldPrice: Number(restaurant.meal.original_price),
      newPrice: Number(restaurant.meal.price),
      openedAt: this.parseDate(
        restaurant.for_day,
        restaurant.package_day.collection_day.opened_at,
      ),
      closedAt: this.parseDate(
        restaurant.for_day,
        restaurant.package_day.collection_day.closed_at,
      ),
    }));
  }

  private parseDate(baseDateIso: string, dateToUpdateIso: string) {
    const baseDate = DateTime.fromISO(baseDateIso);
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
