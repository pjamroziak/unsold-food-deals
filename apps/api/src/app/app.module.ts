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
import { DatabaseConfig, RedisConfig, RootConfig } from './app.config';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';

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

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: dotenvLoader({
        separator: '__',
      }),
    }),
    CacheModule.registerAsync(redisFactory),
    MikroOrmModule.forRootAsync(mikroOrmFactory),
    RoutesModule,
  ],
})
export class AppModule {}
