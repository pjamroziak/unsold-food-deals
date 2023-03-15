export enum EventType {
  PublishedOffer = 'published-offer',
  PublishedCityToScrap = 'published-city-to-scrap',
  RequestedScrappingOffers = 'requested-scrapping-offer',
}

export interface AsyncEvent<T = unknown> {
  name: EventType;
  payload?: T;
}
