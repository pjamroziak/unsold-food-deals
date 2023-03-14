import { Client, ClientType } from '@app/entities/client.entity';
import { User } from '@app/entities/user.entity';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ClientNotFoundException } from '../exceptions';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ClientRepository } from '../repositories/client.repository';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly clientRepository: ClientRepository,
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

  async getClientIds(
    offerName: string,
    clientType: ClientType,
    cityId: number,
  ) {
    const clients = await this.clientRepository.findClientsByFilters({
      name: offerName,
      clientType,
      cityId,
    });

    console.log(clients);

    return clients.map(({ client_id }) => client_id);
  }
}
