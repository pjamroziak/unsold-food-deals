import { Client } from '@app/entities/client.entity';
import { User } from '@app/entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ClientNotFoundException } from '../exceptions';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
  ) {}

  async findUser(client: Pick<Client, 'clientId' | 'clientType'>) {
    const foundUser = await this.userRepository.findOne({
      clients: { ...client },
    });

    if (!foundUser) {
      throw new ClientNotFoundException(client);
    }

    return foundUser;
  }
}
