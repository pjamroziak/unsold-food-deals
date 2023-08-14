import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import { AuthService } from './auth.service';
import { setAxiosCookie } from '../utils';

@Injectable()
export class ItemsProxyService {
  constructor(
    private readonly authService: AuthService,
    private readonly http: Axios
  ) {}

  async post<R, P = any>(url: string, payload: P): Promise<R> {
    const token = await this.authService.getToken();

    const richedPayload = {
      user_id: token.userId,
      ...payload,
    };

    const result = await this.http.post<R>(url, richedPayload, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    setAxiosCookie(result.headers, this.http);

    return result.data;
  }
}
