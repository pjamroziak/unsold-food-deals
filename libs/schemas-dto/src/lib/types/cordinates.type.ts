import { z } from 'nestjs-zod/z';
import { CordinatesSchema } from '../schemas';

export type Cordinates = z.infer<typeof CordinatesSchema>;
