import { Injectable } from '@nestjs/common';
import { SendMessageDiscordCommunityChannelStrategy } from './strategies/discord-community-channel.strategy';
import { SendMessageTelegramStrategy } from './strategies/telegram.strategy';
import { Offer } from '@unsold-food-deals/schemas';

@Injectable()
export class SendMessageService {
  constructor(
    private readonly discordCommunityChannelStrategy: SendMessageDiscordCommunityChannelStrategy,
    private readonly telegramStrategy: SendMessageTelegramStrategy
  ) {}

  async send(offer: Offer) {
    await Promise.allSettled([
      this.discordCommunityChannelStrategy.execute(offer),
      this.telegramStrategy.execute(offer),
    ]);
  }
}
