import { ConfigType, registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis-config', () => ({
  config: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) | 6379,
  },
}));

export type RedisConfig = ConfigType<typeof redisConfig>;
