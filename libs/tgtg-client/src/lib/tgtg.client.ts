import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ItemsService } from './services/items.service';

@Injectable()
export class TooGoodToGoClient implements OnModuleInit {
  constructor(
    private readonly authSerivce: AuthService,

    public readonly items: ItemsService
  ) {}

  async onModuleInit() {
    await this.authSerivce.login();
  }
}
