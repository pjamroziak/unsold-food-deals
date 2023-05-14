import { z } from 'nestjs-zod/z';
import { PaginationResponseSchema } from './pagination.schema';
import { IdSchema } from './id.schema';

export const UserSchema = z.object({});

export const OptionalUserSchema = z.object({});

export const PaginatedUserSchema = PaginationResponseSchema.merge(
  z.object({
    results: z.array(z.from(IdSchema.merge(UserSchema))),
  })
);
