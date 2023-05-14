import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { City } from '../../entities';

@Module({
  imports: [MikroOrmModule.forFeature([City])],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
