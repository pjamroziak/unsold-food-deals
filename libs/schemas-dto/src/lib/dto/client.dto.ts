import { createZodDto } from 'nestjs-zod';
import {
  ClientSchema,
  OptionalClientSchema,
  OptionalIdSchema,
  PaginationRequestSchema,
} from '../schemas';

export class FindClientDto extends createZodDto(
  OptionalIdSchema.merge(OptionalClientSchema.merge(PaginationRequestSchema))
) {}
export class CreateClientDto extends createZodDto(ClientSchema) {}
export class UpdateClientDto extends createZodDto(OptionalClientSchema) {}
