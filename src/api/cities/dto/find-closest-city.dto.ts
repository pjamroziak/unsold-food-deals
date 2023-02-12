import { IsNumber } from 'class-validator';

export class FindClosestCityDto {
  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;
}
