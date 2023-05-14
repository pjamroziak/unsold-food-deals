import { Inject, Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';
import { ApiClientOptions } from '../api-client-options.interface';
import { MODULE_OPTIONS_TOKEN } from '../api-client.module-definition';
import {
  ClientSchema,
  CreateClientDto,
  FindClientDto,
  IdSchema,
  PaginatedClientSchema,
  UpdateClientDto,
} from '@unsold-food-deals/schemas';

@Injectable()
export class ApiClientService {
  private readonly http: Axios;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    { baseUrl }: ApiClientOptions
  ) {
    this.http = axios.create({
      baseURL: baseUrl,
    });
  }

  async find(query: FindClientDto) {
    const response = await this.http.get('api/client', { params: query });
    return PaginatedClientSchema.parse(response.data);
  }

  async create(payload: CreateClientDto) {
    const response = await this.http.post('api/client', payload);
    return IdSchema.merge(ClientSchema).parse(response.data);
  }

  async update(id: string, payload: UpdateClientDto) {
    return this.http.patch(`api/client/${id}`, payload);
  }
}
