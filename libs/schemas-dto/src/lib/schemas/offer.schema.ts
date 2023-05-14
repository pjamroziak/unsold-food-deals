import { z } from 'nestjs-zod/z';

export const OfferSchema = z.object({
  id: z.string(),
  cityId: z.string(),
  name: z.string(),
  stock: z.number(),
  oldPrice: z.number(),
  newPrice: z.number(),
  openedAt: z.string(),
  closedAt: z.string(),
});
