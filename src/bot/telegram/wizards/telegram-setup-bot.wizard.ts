import { ClientType } from '@app/modules/api-client/api-client.types';
import { ApiClient } from '@app/modules/api-client/api.client';
import { Injectable } from '@nestjs/common';
import {
  Wizard,
  SceneEnter,
  Ctx,
  WizardStep,
  On,
  Action,
  Command,
} from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { DefaultContext } from '../telegram-bot.context';

@Injectable()
@Wizard('setup')
export class TelegramSetupWizard {
  constructor(private readonly apiClient: ApiClient) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: DefaultContext) {
    await ctx.reply(
      ctx.t('sendLocation'),
      Markup.keyboard([
        Markup.button.locationRequest(ctx.t('sendLocationBtn')),
      ]).resize(),
    );
  }

  @WizardStep(1)
  @On('location')
  async getLocation(@Ctx() ctx) {
    const foundCity = await this.apiClient.findClosestCity({
      latitude: ctx.message.location.latitude,
      longitude: ctx.message.location.longitude,
    });

    if (foundCity) {
      ctx.session.setup = {
        cityId: foundCity.id,
      };
      await ctx.reply(
        ctx.t('sendLocationFound', { city: foundCity.name }),
        Markup.inlineKeyboard([
          Markup.button.callback('👍', 'CONFIRM_CITY'),
          Markup.button.callback('👎', 'REJECT_CITY'),
        ]),
      );
    } else {
      await ctx.reply(ctx.t('sendLocationNotFound'), Markup.removeKeyboard());
      ctx.scene.leave();
    }

    ctx.wizard.next();
  }

  @WizardStep(1)
  @Command('cancelSetup')
  async cancelSetup(@Ctx() ctx) {
    await ctx.reply(ctx.t('sendLocationCancel'), Markup.removeKeyboard());
    ctx.session.setup = null;
    ctx.scene.leave();
  }

  @WizardStep(2)
  @Action('REJECT_CITY')
  async rejectCity(@Ctx() ctx) {
    await ctx.reply(
      ctx.t('sendLocationAgain'),
      Markup.keyboard([
        Markup.button.locationRequest(ctx.t('sendLocationBtn')),
      ]).resize(),
    );
    ctx.wizard.back();
  }

  @WizardStep(2)
  @Action('CONFIRM_CITY')
  async confirmCity(@Ctx() ctx) {
    const user = await this.apiClient.createUser({
      clientId: ctx.update.callback_query.from.id.toString(),
      clientType: ClientType.Telegram,
      cityId: ctx.session.setup.cityId,
    });

    if (user) {
      await ctx.reply(ctx.t('sendLocationFinish'), Markup.removeKeyboard());
    } else {
      await ctx.reply(ctx.t('sendLocationError'), Markup.removeKeyboard());
    }

    ctx.scene.leave();
  }
}
