import { createZodDto } from 'nestjs-zod';
import { SendMessageToClientsSchema } from '../schemas';

export class SendMessageToClientsDto extends createZodDto(
  SendMessageToClientsSchema
) {}
