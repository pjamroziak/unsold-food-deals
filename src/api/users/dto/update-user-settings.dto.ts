import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsBoolean()
  enabledNotifications?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  filters?: string[];
}
