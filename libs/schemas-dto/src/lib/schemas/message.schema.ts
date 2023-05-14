import { z } from 'nestjs-zod/z';

export const MessageSchema = z.object({
  chatId: z.string(),
  payload: z.string(),
});
