import { Module } from '@nestjs/common';
import * as Bull from 'bullmq';
import { BullModule } from '@nestjs/bullmq';
import { ConsumersModule } from './consumers/consumers.module';
import { RedisConfig, RootConfig } from './app.config';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import {
  CacheModule,
  CacheModuleAsyncOptions,
  CacheStore,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

const bullmqFactory = {
  inject: [RedisConfig],
  useFactory: (config: RedisConfig): Bull.QueueOptions => {
    return {
      defaultJobOptions: {
        removeOnComplete: true,
      },
      connection: {
        host: config.host,
        port: config.port,
      },
    };
  },
};

const redisFactory: CacheModuleAsyncOptions = {
  isGlobal: true,
  inject: [RedisConfig],
  useFactory: (config: RedisConfig) => {
    return {
      store: redisStore as unknown as CacheStore,
      url: `redis://${config.host}:${config.port}`,
      ttl: config.ttl,
    };
  },
};

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: dotenvLoader({
        separator: '__',
      }),
    }),
    BullModule.forRootAsync(bullmqFactory),
    CacheModule.registerAsync(redisFactory),
    ConsumersModule,
  ],
})
export class AppModule {}
