import { UserSettings } from '@app/entities/user-settings.entity';
import { Inject, Injectable } from '@nestjs/common';
import axios, { Axios, AxiosResponse } from 'axios';
import { ApiClientOptions } from './api-client-options.interface';
import { MODULE_OPTIONS_TOKEN } from './api-client.module-definition';
import { City, User } from './api-client.types';
import { CreateUserPayload } from './payloads/create-user.payload';
import { FindClosestCityPayload } from './payloads/find-closest-city.payload';
import { FindUserByClientQuery } from './queries/find-user-by-client.query';

@Injectable()
export class ApiClient {
  private readonly http: Axios;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    { baseURL }: ApiClientOptions,
  ) {
    this.http = axios.create({
      baseURL,
    });
  }

  async createUser(payload: CreateUserPayload) {
    const response = await this.http.post<any, AxiosResponse<User>>(
      `/v1/users`,
      payload,
    );

    return response.data;
  }

  async updateUserSettings(userId: number, payload: Partial<UserSettings>) {
    const response = await this.http.patch<any, AxiosResponse<UserSettings>>(
      `/v1/users/${userId}/settings`,
      payload,
    );

    return response.data;
  }

  async findUserByClient(params: FindUserByClientQuery) {
    const response = await this.http.get<any, AxiosResponse<User>>(
      `/v1/clients/${params.clientType}/${params.clientId}/user`,
      { validateStatus: (status) => status >= 200 && status < 500 },
    );

    if (response.status === 404) {
      return null;
    }

    return response.data;
  }

  async getCity(id: number) {
    const response = await this.http.get<any, AxiosResponse<City>>(
      `/v1/cities/${id}`,
    );

    return response.data;
  }

  async getCities() {
    const response = await this.http.get<any, AxiosResponse<City[]>>(
      '/v1/cities',
    );

    return response.data;
  }

  async findClosestCity(cords: FindClosestCityPayload) {
    const response = await this.http.post<
      FindClosestCityPayload,
      AxiosResponse<City>
    >('/v1/cities/find', cords, {
      validateStatus: (status) => status > 200 && status < 500,
    });

    if (response.status === 404) {
      return null;
    }

    return response.data;
  }
}
