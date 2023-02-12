import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { RabbitRPC, RabbitPayload } from '@golevelup/nestjs-rabbitmq';
import { Offer } from '@app/services/offers/offer.types';
import { CityService } from '@app/api/cities/city.service';
import { OfferWithCityId } from '@app/common/types';
import { ClientType } from '@app/entities/client.entity';
import { ApiClient } from '@app/modules/api-client/api.client';

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
  async handle(@RabbitPayload() message: OfferWithCityId) {
    const city = await this.apiClient.getCity(message.cityId);

    for (const user of city.users) {
      const canSend =
        user.settings.filters.length === 0 ||
        user.settings.filters.find((filter) =>
          message.name.toLowerCase().includes(filter),
        );

      if (canSend) {
        this.bot.telegram
          .sendMessage(user.clients[0].clientId, this.createMessage(message), {
            parse_mode: 'Markdown',
          })
          .catch((error) => {
            this.logger.error(
              `[Foodsi] Cannot send message to user, reason: ${
                error.message
              } | ${{ ...message }}`,
            );
          });
      }
    }
  }

  private createMessage(offer: Offer) {
    return `
*${offer.name}*:
Ilość: ${offer.stock}
Cena: ${offer.newPrice} / ${offer.oldPrice} zł
Odbiór między: ${offer.openedAt} - ${offer.closedAt}
`;
  }
}
