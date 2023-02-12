import { I18nFlavor } from '@grammyjs/i18n';
import { Context } from 'telegraf';

export type DefaultContext = Context & I18nFlavor;
export type ContextWithLocation = Context & I18nFlavor & Location;
