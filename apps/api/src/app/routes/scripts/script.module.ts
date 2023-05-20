import { Module } from '@nestjs/common';
import { ScriptController } from './script.controller';
import { ScriptService } from './script.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Client } from '../../entities';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    MikroOrmModule.forFeature([Client]),
    BullModule.registerQueue({
      name: 'send-message',
    }),
  ],
  controllers: [ScriptController],
  providers: [ScriptService],
})
export class ScriptModule {}
