import { z } from 'nestjs-zod/z';
import { PaginationResponseSchema } from './pagination.schema';
import { IdSchema } from './id.schema';

export enum ClientType {
  TELEGRAM = 'telegram',
}

export const ClientSchema = z.object({
  chatId: z.string(),
  type: z.nativeEnum(ClientType),
  enabled: z.boolean(),
  city: z.string().optional(),
  user: z.string().optional(),
});

export const OptionalClientSchema = z.object({
  chatId: z.string().optional(),
  type: z.nativeEnum(ClientType).optional(),
  enabled: z.boolean().optional(),
  city: z.string().optional(),
  user: z.string().optional(),
});

export const PaginatedClientSchema = PaginationResponseSchema.merge(
  z.object({
    results: z.array(z.from(IdSchema.merge(ClientSchema))),
  })
);
