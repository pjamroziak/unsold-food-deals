import { Injectable, UseFilters } from '@nestjs/common';
import {
  Action,
  Command,
  Ctx,
  On,
  SceneEnter,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import { BotWizard } from '../constants';
import { UnexpectedExceptionFilter } from '../filters/unexpected-exception.filter';
import { ApiClient } from '@unsold-food-deals/api-client';
import { Context, Markup, Scenes } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { I18nContext, LocationContext, SessionContext } from '../types';
import { ClientType } from '@unsold-food-deals/schemas';

type WizardContext = Context &
  SceneContext &
  I18nContext &
  SessionContext &
  Scenes.WizardContext;

@Injectable()
@Wizard(BotWizard.SET_CITY)
@UseFilters(UnexpectedExceptionFilter)
export class SetCityWizard {
  constructor(private readonly apiClient: ApiClient) {}

  @SceneEnter()
  async start(@Ctx() ctx: WizardContext) {
    await ctx.reply(
      ctx.t('setcity-welcome'),
      Markup.keyboard([
        Markup.button.locationRequest(ctx.t('setcity-send-location-btn')),
      ]).resize()
    );
  }

  @WizardStep(1)
  @Command('cancel')
  async cancelsetcity(@Ctx() ctx: WizardContext) {
    await ctx.reply(ctx.t('setcity-cancel'), Markup.removeKeyboard());
    ctx.session.setcity = undefined;
    await ctx.scene.leave();
  }

  @WizardStep(1)
  @On('location')
  async onLocation(@Ctx() ctx: WizardContext & LocationContext) {
    const city = await this.apiClient.city.findClosest({
      latitude: ctx.message.location.latitude,
      longitude: ctx.message.location.longitude,
    });

    if (!city) {
      ctx.reply(ctx.t('setcity-location-not-found'), Markup.removeKeyboard());
      await ctx.scene.leave();
      return;
    }

    ctx.session.setcity = {
      cityId: city.id,
    };

    await ctx.reply(
      ctx.t('setcity-location-found', { city: city.name }),
      Markup.inlineKeyboard([
        Markup.button.callback('👍', 'CONFIRM_CITY'),
        Markup.button.callback('👎', 'REJECT_CITY'),
      ])
    );

    ctx.wizard.next();
  }

  @WizardStep(2)
  @Action('REJECT_CITY')
  async rejectCity(@Ctx() ctx: WizardContext) {
    await ctx.reply(
      ctx.t('setcity-location-again'),
      Markup.keyboard([
        Markup.button.locationRequest(ctx.t('setcity-send-location-btn')),
      ]).resize()
    );

    ctx.wizard.back();
  }

  @WizardStep(2)
  @Action('CONFIRM_CITY')
  async confirmCity(@Ctx() ctx: WizardContext) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const chatId = ctx.update.callback_query.from.id.toString();
    await this.createUserAndClient(chatId, ctx.session.setcity.cityId);

    await ctx.reply(ctx.t('setcity-finish'), Markup.removeKeyboard());
    await ctx.scene.leave();
  }

  private async getClient(chatId: string) {
    const foundClients = await this.apiClient.client.find({
      chatId,
    });

    return foundClients.count === 1 ? foundClients.results[0] : null;
  }

  private async createUserAndClient(chatId: string, cityId: string) {
    const client = await this.getClient(chatId);

    if (!client) {
      const user = await this.apiClient.user.create({});
      await this.apiClient.client.create({
        chatId,
        city: cityId,
        user: user.id,
        type: ClientType.TELEGRAM,
        enabled: true,
        filters: [],
      });
    } else {
      let userId = client.user;
      if (!userId) {
        const user = await this.apiClient.user.create({});
        userId = user.id;
      }

      await this.apiClient.client.update(client.id, {
        user: userId,
        enabled: true,
        city: cityId,
      });
    }
  }
}
