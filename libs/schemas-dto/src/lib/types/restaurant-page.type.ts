import { z } from 'nestjs-zod/z';
import { RestaurantPageSchema } from '../schemas';

export type RestaurantPage = z.infer<typeof RestaurantPageSchema>;
