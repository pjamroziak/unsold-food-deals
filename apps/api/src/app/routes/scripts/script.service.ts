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
    const clients = await this.clientRepository.find({
      id: { $in: payload.clients },
    });

    await this.queue.addBulk(
      clients.map((client) => ({
        name: 'send-message',
        data: {
          chatId: client.chatId,
          payload: payload.message,
        },
        opts: { removeOnComplete: true, removeOnFail: true },
      }))
    );

    this.logger.log({ clients: payload.clients }, 'sent message to clients');
  }
}
