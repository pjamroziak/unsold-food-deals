import { Injectable } from '@nestjs/common';
import { IAuthStrategy } from './auth-strategy.interface';
import { RefreshTokenResponse, Token } from '../types';
import { Axios } from 'axios';
import { AccessTokenAuthOptions } from '../tgtg-client-options.interface';
import { setAxiosCookie } from '../utils';

@Injectable()
export class AccessTokenAuthStrategy
  implements IAuthStrategy<AccessTokenAuthOptions>
{
  constructor(private readonly http: Axios) {}

  async execute(payload: AccessTokenAuthOptions): Promise<Token> {
    if (!payload.userId) {
      throw new Error(
        'userId is required refreshing access token authorization'
      );
    }

    const result = await this.http.post<RefreshTokenResponse>(
      'auth/v3/token/refresh',
      {
        refresh_token: payload.refreshToken,
      }
    );

    setAxiosCookie(result.headers, this.http);

    return {
      accessToken: result.data.access_token,
      refreshToken: result.data.refresh_token,
      userId: payload.userId,
    };
  }
}
