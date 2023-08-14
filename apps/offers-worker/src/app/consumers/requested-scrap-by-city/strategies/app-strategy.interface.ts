import { City, Offer } from '@unsold-food-deals/schemas';

export interface IAppStrategy {
  execute(city: City): Promise<Offer[]>;
}
