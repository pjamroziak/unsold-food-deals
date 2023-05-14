import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { ClientService } from './client.service';
import {
  CreateClientDto,
  FindClientDto,
  IdParamsDto,
  UpdateClientDto,
} from '@unsold-food-deals/schemas';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async find(@Query() payload: FindClientDto) {
    return this.clientService.retrieveBy(payload);
  }

  @Post()
  async create(@Body() payload: CreateClientDto) {
    return this.clientService.create(payload);
  }

  @Patch(':id')
  async update(@Param() { id }: IdParamsDto, @Body() payload: UpdateClientDto) {
    return this.clientService.update(id, payload);
  }
}
