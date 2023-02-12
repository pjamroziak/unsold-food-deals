import { Client } from '@app/entities/client.entity';
import { User } from '@app/entities/user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Client, User] })],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
