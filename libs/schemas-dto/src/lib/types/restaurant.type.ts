import { z } from 'nestjs-zod/z';
import { RestaurantSchema } from '../schemas';

export type Restaurant = z.infer<typeof RestaurantSchema>;
