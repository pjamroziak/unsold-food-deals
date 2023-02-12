import { IsNumber, IsString } from 'class-validator';

export class CreateCityDto {
  @IsString()
  name: string;

  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;

  @IsNumber()
  radius: number;
}
