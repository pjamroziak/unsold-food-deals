import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { DefaultParseMode } from '../../../telegram/constants';
import { ApiClient } from '@unsold-food-deals/api-client';
import { ClientType, Offer } from '@unsold-food-deals/schemas';
import { parseOfferToMessage } from '@unsold-food-deals/offer-message-parser';

type SendMessageTelegrafError = {
  response: {
    error_code: number;
  };
  on: {
    payload: {
      chat_id: string;
    };
  };
};

@Injectable()
export class SendMessageTelegramStrategy {
  private readonly logger = new Logger(SendMessageTelegramStrategy.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
    private readonly apiClient: ApiClient
  ) {}

  async execute(offer: Offer): Promise<void> {
    try {
      const message = parseOfferToMessage(offer);
      const firstResult = await this.apiClient.client.find({
        city: offer.cityId,
        enabled: true,
        type: ClientType.TELEGRAM,
        limit: 1,
        offset: 0,
      });

      const limit = 100;
      const count = firstResult.count;
      let offset = 0;

      while (offset < count) {
        const response = await this.apiClient.client.find({
          city: offer.cityId,
          enabled: true,
          type: ClientType.TELEGRAM,
          limit,
          offset,
        });

        const clients = response.results;

        const chatIds = clients
          .filter(
            (client) =>
              client.filters.length === 0 ||
              client.filters.some(
                (filter) =>
                  offer.name.toLowerCase().search(filter.toLowerCase()) !== -1
              )
          )
          .map(({ chatId }) => chatId);

        for (const chatId of chatIds) {
          await this.sendMessage(chatId, message);
        }

        offset += clients.length;
      }
    } catch (error) {
      this.onError(error);
    }
  }

  async sendMessage(chatId: string, message: string) {
    await this.bot.telegram.sendMessage(chatId, message, DefaultParseMode);
    this.logger.log(
      {
        clients: chatId,
        message,
      },
      'sent message to Telegram Chat'
    );
  }

  async onError(error: any) {
    if (error?.response?.error_code === 403) {
      const casted = error as SendMessageTelegrafError;

      const { results } = await this.apiClient.client.find({
        chatId: casted.on.payload.chat_id,
      });

      if (results.length > 0) {
        const client = results[0];
        await this.apiClient.client.update(client.id, { enabled: false });
      }
    }
  }
}
