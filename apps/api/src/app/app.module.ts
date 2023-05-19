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
    MikroOrmModule.forRootAsync(mikroOrmFactory),
    RoutesModule,
  ],
})
export class AppModule {}
