import { z } from 'nestjs-zod/z';
import { MessageSchema } from '../schemas/message.schema';

export type Message = z.infer<typeof MessageSchema>;
