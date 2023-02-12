import { ClientType } from '@app/entities/client.entity';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  cityId: number;

  @IsString()
  clientId: string;

  @IsEnum(ClientType)
  clientType: ClientType;
}
