import { Injectable } from '@nestjs/common';
import { ItemsProxyService } from './proxy.service';
import { ItemRequest, ItemResponse } from '../types';

@Injectable()
export class ItemsService {
  constructor(private readonly proxyService: ItemsProxyService) {}

  async find(request: ItemRequest) {
    return await this.proxyService.post<ItemResponse>('item/v8/', request);
  }
}
