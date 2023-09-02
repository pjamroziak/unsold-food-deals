import { Injectable, Logger } from '@nestjs/common';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client, TextChannel } from 'discord.js';
import { ApiClient } from '@unsold-food-deals/api-client';
import { ClientType, Offer } from '@unsold-food-deals/schemas';
import { ISendMessageStrategy } from './strategy.interface';
import { parseOfferToMessage } from '@unsold-food-deals/offer-message-parser';

@Injectable()
export class SendMessageDiscordCommunityChannelStrategy
  implements ISendMessageStrategy
{
  private readonly logger = new Logger(
    SendMessageDiscordCommunityChannelStrategy.name
  );

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly apiClient: ApiClient
  ) {}

  async execute(offer: Offer): Promise<void> {
    try {
      const message = parseOfferToMessage(offer);
      const { results } = await this.apiClient.client.find({
        city: offer.cityId,
        enabled: true,
        type: ClientType.DISCORD_COMMUNITY_CHANNEL,
      });

      const promises = results.map((client) => {
        return (
          this.client.channels.cache.get(client.chatId) as TextChannel
        ).send(message);
      });

      await Promise.allSettled(promises);
    } catch (error) {
      this.onError(error);
    }
  }

  onError(error) {
    this.logger.error({ error });
  }
}
