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
    const format = 'yyyy/LL/dd, HH:mm';

    const openedAt = DateTime.fromISO(offer.openedAt).toFormat(format);
    const closedAt = DateTime.fromISO(offer.closedAt).toFormat(format);

    return `
*${offer.name}*
${offer.stock === 1 ? '*Ostatnia sztuka!*' : `Ilość: ${offer.stock}`}
Cena: ${offer.newPrice} / ${offer.oldPrice} zł
Odbiór pomiędzy: 
${openedAt},
${closedAt}
`;
  }
}
