import { MikroOrmModule } from '@mikro-orm/nestjs';
import { City, Client, User } from '../../entities';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MikroOrmModule.forFeature([Client, User, City])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
