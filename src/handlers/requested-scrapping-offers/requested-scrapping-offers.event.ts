import { ApiClient } from '@app/modules/api-client/api.client';
import {
  AsyncEvent,
  EventType,
} from '@app/services/event-publisher/async-event.interface';
import { EventPublisher } from '@app/services/event-publisher/event-publisher.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { EventHandler } from '../handler.interface';

@Injectable()
export class RequestedScrappingOffersEvent implements EventHandler {
  private readonly logger = new Logger(RequestedScrappingOffersEvent.name);

  constructor(
    private readonly apiClient: ApiClient,
    private readonly eventPublisher: EventPublisher,
  ) {}

  @RabbitRPC({
    exchange: 'events',
    routingKey: EventType.RequestedScrappingOffers,
  })
  async handle(event: AsyncEvent<unknown>) {
    this.logger.log(`Processing event: ${event.name}`);

    try {
      const cities = await this.apiClient.getCities();
      for (const city of cities) {
        this.eventPublisher.publish({
          name: EventType.PublishedCityToScrap,
          payload: {
            id: city.id,
            name: city.name,
            latitude: city.latitude,
            longitude: city.longitude,
            radius: city.radius,
          },
        });
      }
      this.logger.log(`Finished event: ${event.name}`);
    } catch (error) {
      this.logger.error(`Failed processing event: ${event.name}`, error);
    }
  }
}
