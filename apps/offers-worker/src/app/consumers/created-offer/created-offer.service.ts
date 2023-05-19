import { Injectable } from '@nestjs/common';
import { ApiClient } from '@unsold-food-deals/api-client';
import { Offer, Client } from '@unsold-food-deals/schemas';
import { DateTime } from 'luxon';

@Injectable()
export class CreatedOfferService {
  constructor(private readonly apiClient: ApiClient) {}

  async getClients(cityId: string) {
    const clients: Client[] = [];

    let count = 0;
    do {
      const response = await this.apiClient.client.find({
        city: cityId,
      });

      count = response.count;
      const results = response.results;

      clients.push(...results);
    } while (clients.length < count);

    return clients;
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
🥡 Pojawiły się ${offer.stock} paczki w *${offer.name}*
💸 ${offer.newPrice} / ${offer.oldPrice} zł 
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
