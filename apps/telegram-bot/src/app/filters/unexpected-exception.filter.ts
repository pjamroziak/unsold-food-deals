import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { I18nContext } from '../types';
import { DefaultParseMode } from '../constants';
import { isAxiosError } from 'axios';

@Catch()
export class UnexpectedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnexpectedExceptionFilter.name);

  async catch(exception: unknown, host: ArgumentsHost) {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context & I18nContext>();

    if (isAxiosError(exception)) {
      this.logger.error(
        {
          errorMessage: exception.message,
          status: exception.status,
          url: exception.response.config.url,
          method: exception.response.config.method,
          data: exception.response.data,
        },
        'unhandled HTTP exception'
      );
    } else {
      this.logger.error({ exception }, 'unhandled exception');
    }

    await ctx.reply(ctx.t('unexpected-error'), DefaultParseMode);
  }
}
