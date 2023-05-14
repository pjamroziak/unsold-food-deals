import { Inject, Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';
import { ApiClientOptions } from '../api-client-options.interface';
import { MODULE_OPTIONS_TOKEN } from '../api-client.module-definition';
import {
  CreateUserDto,
  FindUserDto,
  IdSchema,
  PaginatedUserSchema,
  UpdateUserDto,
  UserSchema,
} from '@unsold-food-deals/schemas';

@Injectable()
export class ApiUserService {
  private readonly http: Axios;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    { baseUrl }: ApiClientOptions
  ) {
    this.http = axios.create({
      baseURL: baseUrl,
    });
  }

  async find(query: FindUserDto) {
    const response = await this.http.get('api/user', { params: query });
    return PaginatedUserSchema.parse(response.data);
  }

  async create(payload: CreateUserDto) {
    const response = await this.http.post('api/user', payload);
    return IdSchema.merge(UserSchema).parse(response.data);
  }

  async update(id: string, payload: UpdateUserDto) {
    return this.http.patch(`api/user/${id}`, payload);
  }
}
