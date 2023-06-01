import { ConfigurableModuleAsyncOptions, Module } from '@nestjs/common';
import * as Bull from 'bullmq';
import { BullModule } from '@nestjs/bullmq';
import { ConsumersModule } from './consumers/consumers.module';
import {
  FoodsiClientConfig,
  LoggerConfig,
  RedisConfig,
  RootConfig,
} from './app.config';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import {
  CacheModule,
  CacheModuleAsyncOptions,
  CacheStore,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { LoggerModule, LoggerModuleAsyncParams } from 'nestjs-pino';
import {
  FoodsiClientModule,
  FoodsiClientOptions,
} from '@unsold-food-deals/foodsi-client';

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

const loggerFactory: LoggerModuleAsyncParams = {
  inject: [LoggerConfig],
  useFactory: (config: LoggerConfig) => {
    return {
      pinoHttp: {
        name: 'grafanacloud-offers-worker',
        level: 'info',
        transport:
          process.env.NODE_ENV === 'production'
            ? {
                target: 'pino-loki',
                options: {
                  silenceErrors: false,
                  host: config.host,
                  basicAuth: {
                    username: config.username,
                    password: config.password,
                  },
                },
              }
            : { target: 'pino-pretty' },
      },
    };
  },
};

const foodsiClientFactory: ConfigurableModuleAsyncOptions<FoodsiClientOptions> =
  {
    inject: [FoodsiClientConfig],
    useFactory: (config: FoodsiClientConfig) => {
      return {
        auth: {
          email: config.email,
          password: config.password,
        },
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
    LoggerModule.forRootAsync(loggerFactory),
    BullModule.forRootAsync(bullmqFactory),
    CacheModule.registerAsync(redisFactory),
    FoodsiClientModule.forRootAsync(foodsiClientFactory),
    ConsumersModule,
  ],
})
export class AppModule {}
