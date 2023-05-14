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

export class TelegramConfig {
  @IsString()
  public readonly token: string;
}

export class ApiConfig {
  @IsString()
  public readonly url: string;
}

export class RootConfig {
  @Type(() => RedisConfig)
  @ValidateNested()
  public readonly redis: RedisConfig;

  @Type(() => TelegramConfig)
  @ValidateNested()
  public readonly telegram: TelegramConfig;

  @Type(() => ApiConfig)
  @ValidateNested()
  public readonly api: ApiConfig;
}
