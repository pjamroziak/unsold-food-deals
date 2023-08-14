import { z } from 'nestjs-zod/z';
import { SupportedApp } from './city.schema';

export const OfferSchema = z.object({
  id: z.string(),
  cityId: z.string(),
  app: z.nativeEnum(SupportedApp),
  name: z.string(),
  stock: z.number(),
  oldPrice: z.number(),
  newPrice: z.number(),
  openedAt: z.string(),
  closedAt: z.string(),
});
