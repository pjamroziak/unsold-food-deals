import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { City, User } from '../../entities';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { parsePaginated } from '../../utils';
import {
  CreateUserDto,
  FindUserDto,
  UpdateUserDto,
} from '@unsold-food-deals/schemas';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>
  ) {}

  async retrieveBy(payload: FindUserDto) {
    const result = await this.userRepository.findAndCount(payload, {
      offset: payload.offset,
      limit: payload.limit,
    });

    return parsePaginated(result);
  }

  async create(payload: CreateUserDto) {
    const newUser = this.userRepository.create(payload);
    await this.userRepository.persistAndFlush(newUser);

    return newUser;
  }

  async update(id: string, payload: UpdateUserDto) {
    const oldUser = await this.userRepository.findOne(id);

    if (!oldUser) {
      throw new NotFoundException(
        'User not found',
        `Cannot find User by ID - ${id}`
      );
    }

    try {
      await this.userRepository.persistAndFlush(wrap(oldUser).assign(payload));
    } catch (error) {
      this.logger.error({ id, payload, error }, 'Updating User failed');
      throw new InternalServerErrorException(error);
    }
  }
}
