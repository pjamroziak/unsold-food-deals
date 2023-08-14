import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ApiClient } from '@unsold-food-deals/api-client';
import { Offer, SupportedApp } from '@unsold-food-deals/schemas';
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

  async sendMessagesToClients(cityId: string, offer: Offer) {
    const payload = this.parseOfferToMessagePayload(offer);

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

      const jobs = clients
        .filter(
          (client) =>
            client.filters.length === 0 ||
            client.filters.some(
              (filter) =>
                offer.name.toLowerCase().search(filter.toLowerCase()) !== -1
            )
        )
        .map(({ chatId }) => ({
          name: 'send-message',
          data: { chatId, payload },
          opts: {
            removeOnComplete: true,
            removeOnFail: true,
          },
        }));

      await this.queue.addBulk(jobs);

      this.logger.log(
        {
          clients: clients.map((client) => ({
            id: client.id,
          })),
          payload,
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
    const weekDay = this.getWeekDayName(offer.openedAt);
    const applicationName = this.getApplicationName(offer.app);

    return `
🥡 ${offerText}
💸 *${offer.newPrice}* / ${offer.oldPrice} zł 
⌛ ${weekDay} między ${openedAt}-${closedAt}
📲 Aplikacja ${applicationName}
`;
  }

  private getApplicationName(app: SupportedApp) {
    switch (app) {
      case SupportedApp.Foodsi:
        return 'Foodsi';
      case SupportedApp.TooGoodToGo:
        return 'TooGoodToGo';
    }
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

  private getWeekDayName(date: string) {
    const nowWeekday = DateTime.now().weekday;
    const weekday = DateTime.fromISO(date).weekday;

    const today = nowWeekday === weekday;
    if (today) {
      return 'Dziś';
    }

    const tomorrow =
      weekday - nowWeekday === 1 || (weekday === 1 && nowWeekday === 7);
    if (tomorrow) {
      return 'Jutro';
    }

    switch (weekday) {
      case 1:
        return 'Poniedziałek';
      case 2:
        return 'Wtorek';
      case 3:
        return 'Środa';
      case 4:
        return 'Czwartek';
      case 5:
        return 'Piątek';
      case 6:
        return 'Sobota';
      case 7:
        return 'Niedziela';
      default:
        return '';
    }
  }
}
