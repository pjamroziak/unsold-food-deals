import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiClient } from '@unsold-food-deals/api-client';
import { isAxiosError } from 'axios';
import { Queue } from 'bullmq';

@Injectable()
export class RequestScrapByCityTask {
  constructor(
    @InjectQueue('requested-scrap-by-city')
    private readonly queue: Queue,
    private readonly apiClient: ApiClient
  ) {}

  @Cron('*/15 * * * * *')
  async process() {
    try {
      const cities = await this.apiClient.city.find();
      for (const city of cities.results) {
        await this.queue.add('requested-scrap-by-city', city);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(JSON.stringify(error.response.data));
      }
    }
  }
}
