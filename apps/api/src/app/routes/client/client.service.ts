import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { City, Client, User } from '../../entities';
import { EntityRepository } from '@mikro-orm/mongodb';
import { parsePaginated } from '../../utils';
import { wrap } from '@mikro-orm/core';
import {
  CreateClientDto,
  FindClientDto,
  UpdateClientDto,
} from '@unsold-food-deals/schemas';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(City)
    private readonly cityRepository: EntityRepository<City>
  ) {}

  async retrieveBy(payload: FindClientDto) {
    const { limit, offset, ...query } = payload;
    const result = await this.clientRepository.findAndCount(query, {
      offset,
      limit,
    });

    return parsePaginated(result);
  }

  async create(payload: CreateClientDto) {
    await Promise.all([
      this.throwErrorIfUserNotExist(payload.user),
      this.throwErrorIfCityNotExist(payload.city),
    ]);

    const newClient = this.clientRepository.create(payload);
    await this.clientRepository.persistAndFlush(newClient);

    return newClient;
  }

  async update(id: string, payload: UpdateClientDto) {
    if (payload.user) {
      await this.throwErrorIfUserNotExist(id);
    }

    if (payload.city) {
      await this.throwErrorIfCityNotExist(payload.city);
    }

    const oldClient = await this.clientRepository.findOne(id);

    if (!oldClient) {
      throw new NotFoundException(
        'Client not found',
        `Cannot find client by ID - ${id}`
      );
    }

    try {
      await this.clientRepository.persistAndFlush(
        wrap(oldClient).assign(payload)
      );
    } catch (error) {
      this.logger.error({ id, payload, error }, 'Updating Client failed');
      throw new InternalServerErrorException(error);
    }
  }

  private async throwErrorIfUserNotExist(id: string) {
    const user = await this.userRepository.find(id);

    if (!user) {
      throw new NotFoundException(
        'User not found',
        `Cannot find user by ID - ${id}`
      );
    }
  }

  private async throwErrorIfCityNotExist(id: string) {
    const user = await this.cityRepository.find(id);

    if (!user) {
      throw new NotFoundException(
        'City not found',
        `Cannot find City by ID - ${id}`
      );
    }
  }
}
