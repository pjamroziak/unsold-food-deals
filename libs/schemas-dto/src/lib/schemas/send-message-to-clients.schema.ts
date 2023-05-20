import { z } from 'nestjs-zod/z';

export const SendMessageToClientsSchema = z.object({
  clients: z.array(z.string()),
  message: z.string(),
});
