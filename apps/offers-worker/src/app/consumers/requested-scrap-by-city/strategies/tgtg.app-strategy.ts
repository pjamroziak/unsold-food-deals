import { Injectable, Logger } from '@nestjs/common';
import { IAppStrategy } from './app-strategy.interface';
import {
  City,
  Cordinates,
  Offer,
  SupportedApp,
} from '@unsold-food-deals/schemas';
import {
  TooGoodToGoClient,
  Item,
  ItemRequest,
} from '@unsold-food-deals/tgtg-client';

const FIRST_PAGE_INDEX = 1;
const MAX_ITEMS_PER_PAGE = 400;

@Injectable()
export class TooGoodToGoAppStrategy implements IAppStrategy {
  private readonly logger = new Logger(TooGoodToGoAppStrategy.name);

  constructor(private readonly tgtgClient: TooGoodToGoClient) {}

  async execute(city: City): Promise<Offer[]> {
    const items = await this.getItems(city);

    const offers: Offer[] = items.map((item) => ({
      id: `${SupportedApp.TooGoodToGo}:${item.item.item_id}:${item.store.store_id}`,
      cityId: city.id,
      app: SupportedApp.TooGoodToGo,
      name: item.store.store_name,
      stock: item.items_available,
      oldPrice: this.getPrice(
        item.item.item_value.minor_units,
        item.item.item_value.decimals
      ),
      newPrice: this.getPrice(
        item.item.item_price.minor_units,
        item.item.item_price.decimals
      ),
      openedAt: item.pickup_interval.start,
      closedAt: item.pickup_interval.end,
    }));

    return offers;
  }

  private getPrice(value: number, decimals: number): number {
    return value / Math.pow(10, decimals);
  }

  private async getItems(city: City): Promise<Item[]> {
    const items: Item[] = [];

    let pageIndex = FIRST_PAGE_INDEX;
    let pageItemsCount = 0;
    do {
      const request = this.createRequest(
        pageIndex++,
        {
          latitude: city.latitude,
          longitude: city.longitude,
        },
        city.radiusInKm
      );

      const result = await this.tgtgClient.items.find(request);
      items.push(...result.items);

      pageItemsCount = result.items.length;
    } while (pageItemsCount === MAX_ITEMS_PER_PAGE);

    this.logger.log(
      {
        city: city.name,
        offers: items.length,
      },
      `completed scrapping TooGoodToGo`
    );

    return items;
  }

  private createRequest(
    page: number,
    cordinates: Cordinates,
    radius: number
  ): ItemRequest {
    return {
      origin: {
        latitude: cordinates.latitude,
        longitude: cordinates.longitude,
      },
      radius,
      page_size: MAX_ITEMS_PER_PAGE,
      page,
      discover: false,
      favorites_only: false,
      with_stock_only: true,
      hidden_only: false,
      we_care_only: false,
      item_categories: [],
      diet_categories: [],
    };
  }
}
