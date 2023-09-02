import { SendMessageDiscordCommunityChannelStrategy } from './discord-community-channel.strategy';
import { SendMessageTelegramStrategy } from './telegram.strategy';

export const strategies = [
  SendMessageDiscordCommunityChannelStrategy,
  SendMessageTelegramStrategy,
];
