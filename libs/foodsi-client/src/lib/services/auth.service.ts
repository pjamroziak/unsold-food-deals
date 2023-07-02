import { Inject, Injectable, Logger } from '@nestjs/common';
import axios, { Axios, AxiosError } from 'axios';
import moize from 'moize';
import { MODULE_OPTIONS_TOKEN } from '../foodsi-client.module-definition';
import { FoodsiClientOptions } from '../foodsi-client-options.interface';

const TOKEN_CACHE_EXPIRY = 6 * 60 * 60 * 1000; // 6 hour

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly http: Axios;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: FoodsiClientOptions
  ) {
    this.http = axios.create({
      baseURL: 'https://api.foodsi.pl',
      headers: {
        'Content-type': 'application/json',
        'system-version': 'android_3.0.0',
        'user-agent': 'okhttp/3.12.0',
      },
    });
  }

  getAuthorizedHeaders = moize(this.signIn.bind(this), {
    maxAge: TOKEN_CACHE_EXPIRY,
  });

  private async signIn() {
    try {
      this.logger.log('refresh authorization token');

      const response = await this.http.post('api/v2/auth/sign_in', {
        email: this.options.auth.email,
        password: this.options.auth.password,
      });

      const { headers } = response;
      return {
        'Access-Token': headers['access-token'],
        Client: headers['client'],
        Uid: headers['uid'],
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error({ ...error.response });
        throw error;
      }
    }
  }
}
