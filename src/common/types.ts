import { Offer } from '@app/services/offers/offer.types';

export type Cordinates = {
  latitude: number;
  longitude: number;
};

export type OfferWithCityId = Offer & { cityId: number };
