import { OfferWithCityId } from '@app/common/types';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Offer } from './offer.types';

@Injectable()
export class OfferService {
  private readonly TTL = 24 * 60 * 60; // 24h

  constructor(
    @InjectRedis()
    private readonly redisClient: Redis,
  ) {}

  async get(id: string) {
    const result = await this.redisClient.get(id);
    return JSON.parse(result) as Offer;
  }

  async set(offer: OfferWithCityId) {
    const result = await this.redisClient.set(
      offer.id,
      JSON.stringify(offer),
      'EX',
      this.TTL,
    );

    return result === 'OK';
  }
}
