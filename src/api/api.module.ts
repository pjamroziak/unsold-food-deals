import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CityModule } from './cities/city.module';
import { ClientModule } from './clients/client.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [MikroOrmModule.forRoot(), CityModule, UserModule, ClientModule],
})
export class ApiModule {}
