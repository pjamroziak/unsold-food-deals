import { ClientType } from '@app/entities/client.entity';
import { Controller, Get, Param } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller({
  path: 'clients',
  version: '1',
})
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':clientType/:clientId/user')
  async getUser(
    @Param('clientType') clientType: ClientType,
    @Param('clientId') clientId: string,
  ) {
    return this.clientService.findUser({ clientId, clientType });
  }
}
