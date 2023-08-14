import { ConfigurableModuleAsyncOptions, Module } from '@nestjs/common';
import * as Bull from 'bullmq';
import { BullModule } from '@nestjs/bullmq';
import { ConsumersModule } from './consumers/consumers.module';
import {
  ApiConfig,
  FoodsiConfig,
  LoggerConfig,
  RedisConfig,
  RootConfig,
  TooGoodToGoConfig,
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
import {
  TooGoToGoClientModule,
  TooGoodToGoClientOptions,
} from '@unsold-food-deals/tgtg-client';
import {
  ApiClientModule,
  ApiClientOptions,
} from '@unsold-food-deals/api-client';

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
        transport: {
          target: 'pino-loki',
          options: {
            silenceErrors: false,
            host: config.host,
            basicAuth: {
              username: config.username,
              password: config.password,
            },
          },
        },
      },
    };
  },
};

const foodsiClientFactory: ConfigurableModuleAsyncOptions<FoodsiClientOptions> =
  {
    inject: [FoodsiConfig],
    useFactory: (config: FoodsiConfig) => {
      return {
        auth: {
          email: config.email,
          password: config.password,
        },
      };
    },
  };

const tgtgClientFactory: ConfigurableModuleAsyncOptions<TooGoodToGoClientOptions> =
  {
    inject: [TooGoodToGoConfig],
    useFactory: (config: TooGoodToGoConfig) => {
      return {
        auth: {
          accessToken: config.accessToken,
          refreshToken: config.refreshToken,
          userId: config.userId,
        },
      };
    },
  };

const apiClientFactory: ConfigurableModuleAsyncOptions<ApiClientOptions> = {
  inject: [ApiConfig],
  useFactory: (config: ApiConfig) => {
    return {
      baseUrl: config.url,
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
    TooGoToGoClientModule.forRootAsync(tgtgClientFactory),
    ApiClientModule.forRootAsync(apiClientFactory),
    ConsumersModule,
  ],
})
export class AppModule {}
