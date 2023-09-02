import { Injectable, Logger, UseFilters } from '@nestjs/common';
import { ApiClient } from '@unsold-food-deals/api-client';
import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { I18nContext, SessionContext } from '../types';
import { ClientType } from '@unsold-food-deals/schemas';
import { BotWizard, DefaultParseMode } from '../constants';
import { UnexpectedExceptionFilter } from '../filters/unexpected-exception.filter';

type CoreContext = Context & SceneContext & I18nContext & SessionContext;

@Injectable()
@Update()
@UseFilters(UnexpectedExceptionFilter)
export class CoreUpdate {
  private readonly logger = new Logger(CoreUpdate.name);

  constructor(private readonly apiClient: ApiClient) {}

  @Start()
  async start(@Ctx() ctx: CoreContext) {
    await this.refreshSession(ctx);

    const message = ctx.t(ctx.session.clientId ? 'welcome-back' : 'welcome', {
      name: ctx.from.first_name,
    });

    await ctx.reply(message, DefaultParseMode);
  }

  @Command('cities')
  async cities(@Ctx() ctx: CoreContext) {
    const response = await this.apiClient.city.find();
    const cities = response.results.map((city) => city.name).join(', \n');

    await ctx.reply(ctx.t('city-list', { cities }), DefaultParseMode);
  }

  @Command('setcity')
  async setCity(@Ctx() ctx: CoreContext) {
    await ctx.scene.enter(BotWizard.SET_CITY);
  }

  @Command('setfilters')
  async setFilters(@Ctx() ctx: CoreContext) {
    await this.refreshSession(ctx);

    if (!ctx.session.clientId) {
      await ctx.reply(ctx.t('missing-session-error'), DefaultParseMode);
    } else {
      await ctx.scene.enter(BotWizard.SET_FITLERS);
    }
  }

  @Command('help')
  async help(@Ctx() ctx: CoreContext) {
    await ctx.reply(ctx.t('help'), DefaultParseMode);
  }

  private async refreshSession(ctx: CoreContext) {
    if (!ctx.session.clientId) {
      try {
        ctx.session.clientId = await this.getClientId(
          String(ctx.message.from.id)
        );
      } catch (error) {
        ctx.session.clientId = undefined;
      }
    }
  }

  private async getClientId(chatId: string) {
    try {
      const clients = await this.apiClient.client.find({
        type: ClientType.TELEGRAM,
        chatId,
      });

      if (
        !clients ||
        clients.results.length === 0 ||
        !clients.results[0].user
      ) {
        return null;
      }

      if (clients.results.length > 1) {
        this.logger.warn({ chatId }, 'API return more than one client');
      }

      return clients.results[0].id;
    } catch (error) {
      this.logger.error(
        {
          chatId,
          error,
        },
        'Request for getting clients failed'
      );

      throw error;
    }
  }
}
