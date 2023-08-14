import { Inject } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from '../tgtg-client.module-definition';
import { TooGoodToGoClientOptions } from '../tgtg-client-options.interface';
import moize from 'moize';
import { Token } from '../types';
import { EmailAuthStrategy, AccessTokenAuthStrategy } from '../strategies';

const TOKEN_CACHE_EXPIRY = 86400; // 24h

export class AuthService {
  private token: Token | null = null;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: TooGoodToGoClientOptions,
    private readonly emailAuthStrategy: EmailAuthStrategy,
    private readonly accessTokenStrategy: AccessTokenAuthStrategy
  ) {}

  public getToken = moize(this.refreshToken.bind(this), {
    maxAge: TOKEN_CACHE_EXPIRY,
  });

  public async login() {
    if ('accessToken' in this.options.auth) {
      this.token = await this.accessTokenStrategy.execute(this.options.auth);
    } else if ('email' in this.options.auth) {
      this.token = await this.emailAuthStrategy.execute(this.options.auth);
    } else {
      throw new Error('Authorization token is missing');
    }
  }

  private async refreshToken() {
    if (!this.token) {
      throw new Error('Authorization token is missing');
    }

    this.token = await this.accessTokenStrategy.execute(this.token);
    return this.token;
  }
}
