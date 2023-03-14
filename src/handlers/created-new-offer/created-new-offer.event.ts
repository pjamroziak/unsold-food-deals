import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { RabbitRPC, RabbitPayload } from '@golevelup/nestjs-rabbitmq';
import { ApiClient } from '@app/modules/api-client/api.client';
import { DateTime } from 'luxon';
import { ClientType } from '@app/modules/api-client/api-client.types';
import { OfferMessage } from '@app/services/offers/redis.types';

@Injectable()
export class CreatedNewOfferEvent {
  private readonly logger = new Logger(CreatedNewOfferEvent.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly apiClient: ApiClient,
  ) {}

  @RabbitRPC({
    exchange: 'offers',
    queue: 'telegram',
  })
  async handle(@RabbitPayload() message: OfferMessage) {
    const clientIds = await this.apiClient.findClientsIdsByFilters(
      message.name,
      ClientType.Telegram,
      message.cityId,
    );

    for (const clientId of clientIds) {
      void this.bot.telegram
        .sendMessage(clientId, this.createMessage(message), {
          parse_mode: 'Markdown',
        })
        .catch((error) => {
          this.logger.error(
            `[Telegram] Cannot send message to user, reason: ${error.message}`,
          );
        });
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
