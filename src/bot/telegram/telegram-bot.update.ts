import { ClientType } from '@app/modules/api-client/api-client.types';
import { ApiClient } from '@app/modules/api-client/api.client';
import { Injectable, Logger } from '@nestjs/common';
import { Update, Start, Ctx, Command } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { DefaultContext } from './telegram-bot.context';

@Injectable()
@Update()
export class TelegramBotUpdate {
  private readonly logger = new Logger(TelegramBotUpdate.name);

  constructor(private readonly apiClient: ApiClient) {}

  @Start()
  async start(@Ctx() ctx) {
    if (!this.isUserInSession(ctx)) {
      ctx.session.userId = await this.getUserId(ctx.update.message.from.id);
    }

    await ctx.reply(ctx.t('greeting'), { parse_mode: 'Markdown' });
  }

  @Command('cities')
  async displayCities(@Ctx() ctx: DefaultContext) {
    const cities = await this.apiClient.getCities();
    const names = cities.map((city) => city.name).join(', ');

    await ctx.reply(ctx.t('cityList', { cities: names }), {
      parse_mode: 'Markdown',
    });
  }

  @Command('setup')
  async setup(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('setup');
  }

  @Command('setFilters')
  async filters(@Ctx() ctx) {
    if (!this.isUserInSession(ctx)) {
      await ctx.reply(ctx.t('noAccountError'), { parse_mode: 'Markdown' });
    } else {
      await ctx.scene.enter('setFilters');
    }
  }

  private async isUserInSession(ctx) {
    let userId = ctx.session.userId;
    if (!userId) {
      userId = await this.getUserId(ctx.update.message.from.id);
    }

    return !!userId;
  }

  private async getUserId(clientId: string) {
    try {
      const user = await this.apiClient.findUserByClient({
        clientId,
        clientType: ClientType.Telegram,
      });

      if (!user) {
        return null;
      }

      return user.id;
    } catch (error) {
      this.logger.error(`Cannot find User | ${error.message}`);

      return null;
    }
  }
}
