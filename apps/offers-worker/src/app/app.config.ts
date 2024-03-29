import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class RedisConfig {
  @IsString()
  public readonly host: string;
  @IsNumber()
  @Transform((params) => {
    return parseInt(params.value);
  })
  public readonly port: number;
  @IsNumber()
  @Transform((params) => {
    return parseInt(params.value);
  })
  public readonly ttl: number;
}

export class ApiConfig {
  @IsString()
  public readonly url: string;
}

export class LoggerConfig {
  @IsString()
  public readonly host: string;
  @IsString()
  public readonly username: string;
  @IsString()
  public readonly password: string;
}

export class FoodsiConfig {
  @IsString()
  public readonly email: string;
  @IsString()
  public readonly password: string;
}

export class TooGoodToGoConfig {
  @IsString()
  public readonly accessToken: string;
  @IsString()
  public readonly refreshToken: string;
  @IsString()
  public readonly userId: string;
}

export class RootConfig {
  @Type(() => RedisConfig)
  @ValidateNested()
  public readonly redis: RedisConfig;

  @Type(() => ApiConfig)
  @ValidateNested()
  public readonly api: ApiConfig;

  @Type(() => LoggerConfig)
  @ValidateNested()
  public readonly logger: LoggerConfig;

  @Type(() => FoodsiConfig)
  @ValidateNested()
  public readonly foodsi: FoodsiConfig;

  @Type(() => TooGoodToGoConfig)
  @ValidateNested()
  public readonly tgtg: TooGoodToGoConfig;
}
