import { Injectable, Logger } from '@nestjs/common';
import { City, Offer, SupportedApp } from '@unsold-food-deals/schemas';
import { FoodsiAppStrategy } from './strategies/foodsi.app-strategy';
import { TooGoodToGoAppStrategy } from './strategies';

@Injectable()
export class RequestedScrapByCityService {
  private readonly logger = new Logger(RequestedScrapByCityService.name);

  constructor(
    private readonly foodsiStrategy: FoodsiAppStrategy,
    private readonly tgtgStrategy: TooGoodToGoAppStrategy
  ) {}

  async getOffers(city: City): Promise<Offer[]> {
    const offers: Offer[] = [];
    const promises = [];

    if (city.supportedApps.includes(SupportedApp.Foodsi)) {
      promises.push(this.foodsiStrategy.execute(city));
    }

    if (city.supportedApps.includes(SupportedApp.TooGoodToGo)) {
      promises.push(this.tgtgStrategy.execute(city));
    }

    const resolvedPromises = await Promise.allSettled(promises);

    offers.push(
      ...resolvedPromises
        .filter((promise) => promise.status === 'fulfilled')
        .reduce(
          (prev, next) => [
            ...prev,
            ...(next as PromiseFulfilledResult<Offer[]>).value,
          ],
          []
        )
    );

    resolvedPromises
      .filter((promise) => promise.status === 'rejected')
      .forEach((promise) =>
        this.logger.error((promise as PromiseRejectedResult).reason)
      );

    return offers;
  }
}
