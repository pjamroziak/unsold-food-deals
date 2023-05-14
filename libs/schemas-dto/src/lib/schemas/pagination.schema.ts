import { z } from 'nestjs-zod/z';

export const PaginationRequestSchema = z.object({
  offset: z.number().min(0).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export const PaginationResponseSchema = z.object({
  count: z.number(),
});
