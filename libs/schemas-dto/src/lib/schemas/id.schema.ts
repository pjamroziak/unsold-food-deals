import { z } from 'nestjs-zod/z';

export const IdSchema = z.object({
  id: z.string(),
});

export const OptionalIdSchema = z.object({
  id: z.string().optional(),
});
