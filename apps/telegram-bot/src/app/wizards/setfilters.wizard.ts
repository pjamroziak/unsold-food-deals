import { Injectable, UseFilters } from '@nestjs/common';
import {
  Command,
  Ctx,
  Hears,
  On,
  SceneEnter,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import { BotWizard, DefaultParseMode } from '../constants';
import { UnexpectedExceptionFilter } from '../filters/unexpected-exception.filter';
import { Context, Scenes } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { I18nContext, SessionContext } from '../types';
import { OptionalClientSchema } from '@unsold-food-deals/schemas';
import { ApiClient } from '@unsold-food-deals/api-client';
import { Message, Update } from 'telegraf/typings/core/types/typegram';

type WizardContext = Context &
  SceneContext &
  I18nContext &
  SessionContext &
  Scenes.WizardContext;

@Injectable()
@Wizard(BotWizard.SET_FITLERS)
@UseFilters(UnexpectedExceptionFilter)
export class SetFiltersWizard {
  constructor(private readonly apiClient: ApiClient) {}

  @SceneEnter()
  async start(@Ctx() ctx: WizardContext) {
    await ctx.reply(ctx.t('setfilters-welcome'), DefaultParseMode);
  }

  @WizardStep(1)
  @Command('cancel')
  async cancel(@Ctx() ctx: WizardContext) {
    await ctx.reply(ctx.t('setfilters-cancel'), DefaultParseMode);
    await ctx.scene.leave();
  }

  @WizardStep(1)
  @Command('empty')
  async empty(@Ctx() ctx: WizardContext) {
    await this.apiClient.client.update(ctx.session.clientId, {
      filters: [],
    });

    await ctx.reply(ctx.t('setfilters-empty-finish'), DefaultParseMode);
    await ctx.scene.leave();
  }

  @WizardStep(1)
  @On('text')
  async onText(
    @Ctx()
    ctx: WizardContext & Context<Update.MessageUpdate<Message.TextMessage>>
  ) {
    const filters = ctx.message.text
      .split(' ')
      .map((filter) => filter.toLowerCase().trim());

    const validationResult = OptionalClientSchema.safeParse({
      filters,
    });

    if (!validationResult.success) {
      await ctx.reply(ctx.t('setfilters-error'), DefaultParseMode);
      return;
    }

    await this.apiClient.client.update(ctx.session.clientId, {
      filters,
    });

    await ctx.reply(
      ctx.t('setfilters-finish', { filters: filters.join(', ') }),
      DefaultParseMode
    );
    await ctx.scene.leave();
  }
}
