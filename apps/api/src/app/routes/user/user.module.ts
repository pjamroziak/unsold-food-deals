import { Module } from '@nestjs/common';
import { User } from '../../entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
