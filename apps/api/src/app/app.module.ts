import { MikroOrmModule, MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import {
  CacheModule,
  CacheModuleAsyncOptions,
  CacheStore,
} from '@nestjs/cache-manager';
import { City, Client, User } from './entities';
import { RoutesModule } from './routes/routes.module';
import { redisStore } from 'cache-manager-redis-store';
import {
  DatabaseConfig,
  LoggerConfig,
  RedisConfig,
  RootConfig,
} from './app.config';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { LoggerModule, LoggerModuleAsyncParams } from 'nestjs-pino';
import { BullModule } from '@nestjs/bullmq';
import * as Bull from 'bullmq';
import {
  isProduction,
  getPinoLokiTransport,
  getPinoPrettyTransport,
} from '@unsold-food-deals/utils';

const mikroOrmFactory: MikroOrmModuleAsyncOptions = {
  inject: [DatabaseConfig],
  useFactory: (config: DatabaseConfig) => {
    return {
      entities: [City, Client, User],
      dbName: config.name,
      clientUrl: config.url,
      type: 'mongo',
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
        name: 'grafanacloud-api',
        level: 'info',
        transport: isProduction()
          ? getPinoLokiTransport(config)
          : getPinoPrettyTransport(),
      },
    };
  },
};

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

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: dotenvLoader({
        separator: '__',
      }),
    }),
    LoggerModule.forRootAsync(loggerFactory),
    CacheModule.registerAsync(redisFactory),
    BullModule.forRootAsync(bullmqFactory),
    MikroOrmModule.forRootAsync(mikroOrmFactory),
    RoutesModule,
  ],
})
export class AppModule {}
