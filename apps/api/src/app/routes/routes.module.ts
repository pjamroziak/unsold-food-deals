import { Module } from '@nestjs/common';
import { CityModule } from './city/city.module';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CityModule, ClientModule, UserModule],
})
export class RoutesModule {}
