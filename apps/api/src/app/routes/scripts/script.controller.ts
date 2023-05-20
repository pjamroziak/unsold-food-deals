import { Body, Controller, Post } from '@nestjs/common';
import { SendMessageToClientsDto } from '@unsold-food-deals/schemas';
import { ScriptService } from './script.service';

@Controller('scripts')
export class ScriptController {
  constructor(private readonly service: ScriptService) {}

  @Post('send-message-to-clients')
  async sendMessageToClients(@Body() payload: SendMessageToClientsDto) {
    return this.service.sendMessageToClients(payload);
  }
}
