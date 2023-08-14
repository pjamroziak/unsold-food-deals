import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EmailAuthOptions } from '../tgtg-client-options.interface';
import { AuthByRequestPollingIdResponse, Token } from '../types';
import { IAuthStrategy } from './auth-strategy.interface';
import { Axios } from 'axios';
import { DeviceType } from '../enums';
import { setAxiosCookie } from '../utils';

const TIME_BETWEEN_POLLING = 5000;

Injectable();
export class EmailAuthStrategy implements IAuthStrategy<EmailAuthOptions> {
  private readonly logger = new Logger(EmailAuthStrategy.name);

  constructor(private readonly http: Axios) {}

  async execute(payload: EmailAuthOptions): Promise<Token> {
    const { request_polling_id } = await this.requestAccessByEmail(
      payload.email
    );

    let token = null;
    let counter = 0;
    const maxRetries = payload.maxRetries || 10;

    let shouldPoll = false;
    do {
      await this.sleep(TIME_BETWEEN_POLLING);

      this.logger.log(
        `Polling for getting access token, attempt - ${counter++}`
      );

      token = await this.pollAccessToken(request_polling_id, payload.email);
      shouldPoll = token === null && counter < maxRetries;
    } while (shouldPoll);

    if (token === null) {
      throw new Error('Authorization by Email failed');
    }

    return token;
  }

  private async requestAccessByEmail(email: string) {
    this.logger.log('Authorize TooGoodToGo Client by email address');

    const result = await this.http.post('auth/v3/authByEmail', {
      email,
      device_type: DeviceType.Android,
    });

    setAxiosCookie(result.headers, this.http);

    return result.data;
  }

  private async pollAccessToken(id: string, email: string) {
    const result = await this.http.post<AuthByRequestPollingIdResponse>(
      'auth/v3/authByRequestPollingId',
      {
        email,
        device_type: DeviceType.Android,
        request_polling_id: id,
      }
    );

    if (result.status === HttpStatus.ACCEPTED) {
      this.logger.warn('Confirm access by message on your email');
      return null;
    }

    setAxiosCookie(result.headers, this.http);

    return {
      accessToken: result.data.access_token,
      refreshToken: result.data.refresh_token,
      userId: result.data.startup_data.user.user_id,
    };
  }

  private sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
