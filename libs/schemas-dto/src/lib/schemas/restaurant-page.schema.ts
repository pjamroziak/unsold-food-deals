import { z } from 'nestjs-zod/z';
import { RestaurantSchema } from './restaurant.schema';

export const RestaurantPageSchema = z.object({
  total_pages: z.number(),
  current_page: z.number(),
  data: z.array(RestaurantSchema),
});
