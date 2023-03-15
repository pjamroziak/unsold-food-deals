import { RedisConfig, redisConfig } from '@app/configs/redis.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';

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
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisServiceModule {}
