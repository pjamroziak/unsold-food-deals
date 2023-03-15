import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { RabbitRPC, RabbitPayload } from '@golevelup/nestjs-rabbitmq';
import { ApiClient } from '@app/modules/api-client/api.client';
import { DateTime } from 'luxon';
import { ClientType } from '@app/modules/api-client/api-client.types';
import { OfferMessage } from '@app/services/redis/redis.types';
import {
  AsyncEvent,
  EventType,
} from '@app/services/event-publisher/async-event.interface';
import { EventHandler } from '../handler.interface';

@Injectable()
export class PublishedOfferEvent implements EventHandler {
  private readonly logger = new Logger(PublishedOfferEvent.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly apiClient: ApiClient,
  ) {}

  @RabbitRPC({
    exchange: 'events',
    routingKey: EventType.PublishedOffer,
  })
  async handle(@RabbitPayload() event: AsyncEvent<OfferMessage>) {
    this.logger.log(`Processing event: ${event.name}`);

    try {
      const { payload: offer } = event;

      const clientIds = await this.apiClient.findClientsIdsByFilters(
        offer.name,
        ClientType.Telegram,
        offer.cityId,
      );

      const promises: Promise<void>[] = [];
      for (const clientId of clientIds) {
        promises.push(
          this.sendMessageToUser(clientId, this.createMessage(offer)),
        );
      }

      await Promise.allSettled(promises);

      this.logger.log(`Finished event: ${event.name}`);
    } catch (error) {
      this.logger.error(`Failed processing event: ${event.name}`, error);
    }
  }

  private async sendMessageToUser(chatId: string, message: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      this.logger.error(`Cannot send message | ${error.message}`);
    }
  }

  private createMessage(offer: OfferMessage) {
    const format = 'yyyy/LL/dd, HH:mm';

    const openedAt = DateTime.fromISO(offer.openedAt).toFormat(format);
    const closedAt = DateTime.fromISO(offer.closedAt).toFormat(format);

    return `
*${offer.name}*
Ilość: ${offer.stock}
Cena: ${offer.newPrice} / ${offer.oldPrice} zł
Odbiór pomiędzy: 
${openedAt},
${closedAt}
`;
  }
}
