import { FoodsiAppStrategy } from './foodsi.app-strategy';
import { TooGoodToGoAppStrategy } from './tgtg.app-strategy';

export * from './app-strategy.interface';
export * from './foodsi.app-strategy';
export * from './tgtg.app-strategy';

export const strategies = [FoodsiAppStrategy, TooGoodToGoAppStrategy];
