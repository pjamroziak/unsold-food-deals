import { Module } from '@nestjs/common';
import { CityFinderService } from './city-finder.service';

@Module({
  providers: [CityFinderService],
  exports: [CityFinderService],
})
export class CityFinderModule {}
