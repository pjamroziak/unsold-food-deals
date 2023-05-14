import { Module } from '@nestjs/common';
import { RequestedScrapByCityModule } from './requested-scrap-by-city/requested-scrap-by-city.module';
import { CreatedOfferModule } from './created-offer/created-offer.module';

@Module({
  imports: [RequestedScrapByCityModule, CreatedOfferModule],
})
export class ConsumersModule {}
