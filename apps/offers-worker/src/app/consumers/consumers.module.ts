import { Module } from '@nestjs/common';
import { RequestedScrapByCityModule } from './requested-scrap-by-city/requested-scrap-by-city.module';

@Module({
  imports: [RequestedScrapByCityModule],
})
export class ConsumersModule {}
