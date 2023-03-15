import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { OfferMessage } from './redis.types';

@Injectable()
export class RedisService {
  private readonly TTL = 24 * 60 * 60; // 24h

  constructor(
    @InjectRedis()
    private readonly redisClient: Redis,
  ) {}

  async get(id: string) {
    const result = await this.redisClient.get(id);
    return JSON.parse(result) as OfferMessage;
  }

  async set(offer: OfferMessage) {
    const result = await this.redisClient.set(
      offer.id,
      JSON.stringify(offer),
      'EX',
      this.TTL,
    );

    return result === 'OK';
  }
}
