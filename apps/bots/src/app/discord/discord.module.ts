import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';

@Module({
  imports: [DiscordModule.forFeature()],
})
export class DiscordBotModule {}
