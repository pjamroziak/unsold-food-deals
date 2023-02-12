import { ApiClient } from '@app/modules/api-client/api.client';
import { Injectable } from '@nestjs/common';
import { Wizard, SceneEnter, Ctx, WizardStep, On } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { DefaultContext } from '../telegram-bot.context';

@Injectable()
@Wizard('setFilters')
export class TelegramFiltersWizard {
  constructor(private readonly apiClient: ApiClient) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: DefaultContext) {
    await ctx.reply(ctx.t('filtersDescription'), Markup.removeKeyboard());
  }

  @WizardStep(1)
  @On('text')
  async getFilterList(@Ctx() ctx) {
    const filters = <string[]>ctx.message.text
      .split(',')
      .slice(0, 5)
      .map((filter: string) => filter.trim().toLowerCase());

    if (filters.length > 0 && filters.length < 5 && filters[0] !== '') {
      const result = await this.apiClient.updateUserSettings(
        ctx.session.userId,
        {
          filters,
        },
      );

      await ctx.reply(
        ctx.t('filtersFinish', { filters: result.filters.join(', ') }),
      );
    }

    ctx.scene.leave();
  }
}
