import { z } from 'nestjs-zod/z';
import { OfferSchema } from '../schemas/offer.schema';

export type Offer = z.infer<typeof OfferSchema>;
