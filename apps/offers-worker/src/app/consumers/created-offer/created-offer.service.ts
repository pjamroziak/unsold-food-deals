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

      const jobs = clients.map(({ chatId }) => ({
        name: 'send-message',
        data: { chatId, payload },
        opts: { removeOnComplete: true, removeOnFail: true },
      }));

      await this.queue.addBulk(jobs);

      this.logger.log(
        {
          clients: clients.map((client) => ({
            id: client.id,
          })),
        },
        'sent message to clients'
      );

      offset += clients.length;
    }
  }

  parseOfferToMessagePayload(offer: Offer) {
    return this.createOfferMessage(offer);
  }

  private createOfferMessage(offer: Offer) {
    const format = 'HH:mm';

    const openedAt = DateTime.fromISO(offer.openedAt).toFormat(format);
    const closedAt = DateTime.fromISO(offer.closedAt).toFormat(format);

    const offerText = this.getAppearOfferVarietyText(offer.stock, offer.name);
    const weekDay = this.getWeekDayName(offer.weekDay);

    return `
🥡 ${offerText}
💸 *${offer.newPrice}* / ${offer.oldPrice} zł 
⌛ ${weekDay} ${openedAt}-${closedAt}
`;
  }

  private getAppearOfferVarietyText(count: number, offerName: string) {
    if (count === 1) {
      return `Pojawiła się *${count}* paczka w *${offerName}*`;
    } else if (count <= 4) {
      return `Pojawiły się *${count}* paczki w *${offerName}*`;
    } else {
      return `Pojawiło się *${count}* paczek w *${offerName}*`;
    }
  }

  private getWeekDayName(weekDay?: number | null) {
    if (!weekDay) return '';

    switch (weekDay) {
      case 1:
        return 'poniedziałek';
      case 2:
        return 'wtorek';
      case 3:
        return 'środa';
      case 4:
        return 'czwartek';
      case 5:
        return 'piątek';
      case 6:
        return 'sobota';
      case 7:
        return 'niedziela';
      default:
        return '';
    }
  }
}
