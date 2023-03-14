import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FoodsiScrapperService } from './foodsi-scrapper.service';
import { RedisService } from '@app/services/offers/redis.service';
import { ApiClient } from '@app/modules/api-client/api.client';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { OfferMessage } from '@app/services/offers/redis.types';

@Injectable()
export class FoodsiScrapperTask {
  private readonly logger = new Logger(FoodsiScrapperTask.name);

  constructor(
    private readonly foodsiScrapperService: FoodsiScrapperService,
    private readonly amqpConnection: AmqpConnection,
    private readonly offerService: RedisService,
    private readonly apiClient: ApiClient,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    const cities = await this.apiClient.getCities();

    for (const city of cities) {
      const cityOffers = await this.foodsiScrapperService.getOffers({
        latitude: city.latitude,
        longitude: city.longitude,
      });

      this.logger.log(
        `[Foodsi] ${city.name} | Found ${cityOffers.length} offers`,
      );
      for (const offer of cityOffers) {
        const cachedOffer = await this.offerService.get(offer.id);
        const canSend =
          !cachedOffer ||
          (offer.stock !== cachedOffer.stock && offer.stock === 1);

        if (canSend) {
          this.publishMessage({ ...offer, cityId: city.id });
        }
      }
    }
  }

  private async publishMessage(offer: OfferMessage) {
    try {
      this.amqpConnection.publish('offers', 'telegram', offer);
      await this.offerService.set(offer);

      this.logger.log(`[Foodsi] Published message: ${JSON.stringify(offer)}`);
    } catch (error) {
      this.logger.error(
        `[Foodsi] Cannot publish message, reason: ${error.message}`,
        ...error,
      );
    }
  }
}
