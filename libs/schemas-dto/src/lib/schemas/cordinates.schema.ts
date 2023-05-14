import { z } from 'nestjs-zod/z';

export const CordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
