import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FoodsiScrapperService } from './foodsi-scrapper.service';
import { OfferService } from '@app/services/offers/offer.service';
import { ApiClient } from '@app/modules/api-client/api.client';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class FoodsiScrapperTask {
  private readonly logger = new Logger(FoodsiScrapperTask.name);

  constructor(
    private readonly foodsiScrapperService: FoodsiScrapperService,
    private readonly amqpConnection: AmqpConnection,
    private readonly offerService: OfferService,
    private readonly apiClient: ApiClient,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.logger.log('[Foodsi] Get available cities');
    const cities = await this.apiClient.getCities();

    for (const city of cities) {
      this.logger.log(`[Foodsi] Get offers for ${city.name}`);
      const cityOffers = await this.foodsiScrapperService.getOffers({
        latitude: city.latitude,
        longitude: city.longitude,
      });

      for (const offer of cityOffers) {
        const cachedOffer = await this.offerService.get(offer.id);
        if (!cachedOffer) {
          void this.offerService.set({ ...offer, cityId: city.id });
          this.amqpConnection.publish('offers', 'telegram', {
            ...offer,
            cityId: city.id,
          });
          continue;
        }

        if (offer.stock !== cachedOffer.stock) {
          if (offer.stock === 1) {
            void this.offerService.set({ ...offer, cityId: city.id });
            this.amqpConnection.publish('offers', 'telegram', {
              ...offer,
              cityId: city.id,
            });
          }
        }
      }
    }
  }
}
