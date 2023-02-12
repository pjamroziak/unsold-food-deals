import { Injectable } from '@nestjs/common';
import { Offer } from './offer.types';

@Injectable()
export class OfferComparator {
  isEqual(previous: Offer, next: Offer) {
    return previous.id === next.id && previous.stock === next.stock;
  }
}
