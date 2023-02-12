import { IsString, IsOptional, IsDateString } from 'class-validator';

export class QueryParamsUser {
  @IsOptional()
  @IsString()
  clientId: string;

  @IsOptional()
  @IsDateString()
  createdAt: string;

  @IsOptional()
  @IsDateString()
  updatedAt: string;
}
