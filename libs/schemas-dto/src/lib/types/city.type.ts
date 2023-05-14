import { z } from 'nestjs-zod/z';
import { CitySchema, IdSchema } from '../schemas';

export type City = z.infer<typeof IdSchema & typeof CitySchema>;
