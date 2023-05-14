import { z } from 'nestjs-zod/z';
import { ClientSchema, IdSchema } from '../schemas';

export type Client = z.infer<typeof IdSchema & typeof ClientSchema>;
