import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiClient } from '@unsold-food-deals/api-client';
import { isAxiosError } from 'axios';
import { Queue } from 'bullmq';

@Injectable()
export class RequestScrapByCityTask {
  private readonly logger = new Logger(RequestScrapByCityTask.name);

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
        this.logger.log({ city: city.name }, 'sent request for scrapping city');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        this.logger.error(
          {
            url: error.response.config.url,
            data: error.response.data,
          },
          'failed request for scrapping city'
        );
      } else {
        this.logger.error({ error });
      }
    }
  }
}
