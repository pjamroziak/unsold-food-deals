import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';
import { ApiClientOptions } from '../api-client-options.interface';
import { MODULE_OPTIONS_TOKEN } from '../api-client.module-definition';
import {
  CitySchema,
  CordinatesDto,
  CreateCityDto,
  FindCityDto,
  IdSchema,
  PaginatedCitySchema,
  UpdateCityDto,
} from '@unsold-food-deals/schemas';

@Injectable()
export class ApiCityService {
  private readonly http: Axios;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    { baseUrl }: ApiClientOptions
  ) {
    this.http = axios.create({
      baseURL: baseUrl,
    });
  }

  async find(query?: FindCityDto) {
    const response = await this.http.get('api/city', { data: query });
    return PaginatedCitySchema.parse(response.data);
  }

  async findClosest(cordinates: CordinatesDto) {
    const response = await this.http.post('api/city/closest', cordinates, {
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 404,
    });

    if (response.status === HttpStatus.NOT_FOUND) {
      return null;
    }

    return IdSchema.merge(CitySchema).parse(response.data);
  }

  async create(payload: CreateCityDto) {
    const response = await this.http.post('api/city', payload);
    return IdSchema.merge(CitySchema).parse(response.data);
  }

  async update(id: string, payload: UpdateCityDto) {
    return this.http.patch(`api/user/${id}`, payload);
  }
}
