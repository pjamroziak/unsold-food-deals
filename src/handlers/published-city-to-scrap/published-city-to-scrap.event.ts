import { City } from '@app/modules/api-client/api-client.types';
import {
  AsyncEvent,
  EventType,
} from '@app/services/event-publisher/async-event.interface';
import { EventPublisher } from '@app/services/event-publisher/event-publisher.service';
import { RedisService } from '@app/services/redis/redis.service';
import { OfferMessage } from '@app/services/redis/redis.types';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { EventHandler } from '../handler.interface';
import { PublishedCityToScrapService } from './published-city-to-scrap.service';

@Injectable()
export class PublishedCityToScrapEvent implements EventHandler {
  private readonly logger = new Logger(PublishedCityToScrapEvent.name);

  constructor(
    private readonly foodsiScrapperService: PublishedCityToScrapService,
    private readonly eventPublisher: EventPublisher,
    private readonly redisService: RedisService,
  ) {}

  @RabbitRPC({
    exchange: 'events',
    queue: 'monolit',
    routingKey: EventType.PublishedCityToScrap,
  })
  async handle(event: AsyncEvent<City>) {
    this.logger.log(`Processing event: ${event.name}`);

    try {
      const { payload: city } = event;

      const cityOffers = await this.foodsiScrapperService.getOffers({
        latitude: city.latitude,
        longitude: city.longitude,
      });

      this.logger.log(`${city.name} | Found ${cityOffers.length} offers`);

      const promises: Promise<void>[] = [];
      for (const offer of cityOffers) {
        promises.push(this.publishMessage({ ...offer, cityId: city.id }));
      }

      await Promise.allSettled(promises);

      this.logger.log(`Finished event: ${event.name}`);
    } catch (error) {
      this.logger.error(`Failed processing event: ${event.name}`, error);
    }
  }

  private async publishMessage(offer: OfferMessage) {
    const cachedOffer = await this.redisService.get(offer.id);
    const canSend =
      !cachedOffer || (offer.stock !== cachedOffer.stock && offer.stock === 1);

    if (!canSend) {
      return Promise.resolve();
    }

    try {
      this.eventPublisher.publish({
        name: EventType.PublishedOffer,
        payload: offer,
      });

      await this.redisService.set({ ...offer });
    } catch (error) {
      this.logger.error(`Cannot publish message | ${error.message}`, ...error);
    }
  }
}
