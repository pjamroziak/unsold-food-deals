import { Injectable } from '@nestjs/common';
import { RestaurantService } from './services';

@Injectable()
export class FoodsiClient {
  constructor(readonly restaurants: RestaurantService) {}
}
