import { Offer } from '@unsold-food-deals/schemas';

export interface ISendMessageStrategy {
  execute(offer: Offer): Promise<void>;
}
