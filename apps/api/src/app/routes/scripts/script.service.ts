import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Client } from '../../entities';
import { EntityRepository } from '@mikro-orm/core';
import { SendMessageToClientsDto } from '@unsold-food-deals/schemas';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class ScriptService {
  private readonly logger = new Logger(ScriptService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
    @InjectQueue('send-message')
    private readonly queue: Queue
  ) {}

  async sendMessageToClients(payload: SendMessageToClientsDto) {
    const clients = await this.clientRepository.find({ id: payload.clients });

    for (const client of clients) {
      this.logger.log(
        {
          clientId: client._id,
          chatId: client.chatId,
          message: payload.message,
        },
        'sending message to clients'
      );
      await this.queue.add(
        'send-message',
        {
          chatId: client.chatId,
          payload,
        },
        { removeOnComplete: true, removeOnFail: true }
      );
    }
  }
}
