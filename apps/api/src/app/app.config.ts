import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class DatabaseConfig {
  @IsString()
  public readonly name: string;
  @IsString()
  public readonly url: string;
}

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

export class LoggerConfig {
  @IsString()
  public readonly host: string;
  @IsString()
  public readonly username: string;
  @IsString()
  public readonly password: string;
}

export class RootConfig {
  @Type(() => DatabaseConfig)
  @ValidateNested()
  public readonly database: DatabaseConfig;

  @Type(() => RedisConfig)
  @ValidateNested()
  public readonly redis: RedisConfig;

  @Type(() => LoggerConfig)
  @ValidateNested()
  public readonly logger: LoggerConfig;
}
