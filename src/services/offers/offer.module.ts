import { RedisConfig, redisConfig } from '@app/configs/redis.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OfferComparator } from './offer.comparator';
import { OfferService } from './offer.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [redisConfig],
        }),
      ],
      useFactory: (config: RedisConfig) => ({ ...config }),
      inject: [redisConfig.KEY],
    }),
  ],
  providers: [OfferService, OfferComparator],
  exports: [OfferService, OfferComparator],
})
export class OfferModule {}
