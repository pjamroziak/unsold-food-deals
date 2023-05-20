import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ApiClient } from '@unsold-food-deals/api-client';
import { Offer } from '@unsold-food-deals/schemas';
import { Queue } from 'bullmq';
import { DateTime } from 'luxon';

@Injectable()
export class CreatedOfferService {
  private readonly logger = new Logger(CreatedOfferService.name);

  constructor(
    @InjectQueue('send-message')
    private readonly queue: Queue,
    private readonly apiClient: ApiClient
  ) {}

  async sendMessagesToClients(cityId: string, payload: string) {
    const firstResult = await this.apiClient.client.find({
      city: cityId,
      enabled: true,
      limit: 1,
      offset: 0,
    });

    const limit = 100;
    const count = firstResult.count;
    let offset = 0;

    while (offset < count) {
      const response = await this.apiClient.client.find({
        city: cityId,
        enabled: true,
        limit,
        offset,
      });

      const clients = response.results;

      for (const { chatId } of clients) {
        this.logger.log(
          {
            chatId,
          },
          'sending message to client'
        );
        this.queue
          .add('send-message', { chatId, payload })
          .catch((error) =>
            this.logger.error({ error }, 'cannot send message to client')
          );
      }

      offset += clients.length;
    }
  }

  parseOfferToMessagePayload(offer: Offer) {
    return offer.stock === 1
      ? this.createLastOfferMessage(offer)
      : this.createOfferMessage(offer);
  }

  private createOfferMessage(offer: Offer) {
    const format = 'HH:mm';

    const openedAt = DateTime.fromISO(offer.openedAt).toFormat(format);
    const closedAt = DateTime.fromISO(offer.closedAt).toFormat(format);

    return `
🥡 Pojawiło się ${offer.stock} paczek w *${offer.name}*
💸 *${offer.newPrice}* / ${offer.oldPrice} zł 
⌛ ${openedAt}-${closedAt}
`;
  }

  private createLastOfferMessage(offer: Offer) {
    return `
❗ *Ostatnia* paczka w *${offer.name}*
💸 *${offer.newPrice}* / ${offer.oldPrice} zł 
`;
  }
}
