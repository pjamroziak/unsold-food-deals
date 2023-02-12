import { City } from '@app/entities/city.entity';
import { User } from '@app/entities/user.entity';
import { CityFinderModule } from '@app/services/city-finder/city-finder.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User, City] }),
    CityFinderModule,
  ],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
