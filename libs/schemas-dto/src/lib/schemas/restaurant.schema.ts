import { z } from 'nestjs-zod/z';

export const RestaurantSchema = z.object({
  id: z.number(),
  meal: z.object({
    original_price: z.string(),
    price: z.string(),
  }),
  name: z.string(),
  package_day: z.object({
    collection_day: z.object({
      closed_at: z.string(),
      opened_at: z.string(),
    }),
    meals_left: z.number().nullable(),
  }),
  package_id: z.number(),
});
