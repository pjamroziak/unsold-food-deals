import { User } from '@app/entities/user.entity';
import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from '../exceptions';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async getBy(where: FilterQuery<User>) {
    const foundUser = await this.userRepository.findOne(where, {
      populate: true,
    });

    if (!foundUser) {
      throw new UserNotFoundException(where);
    }

    return foundUser;
  }

  async create(dto: CreateUserDto) {
    const user = this.userRepository.create({
      clients: [
        {
          clientId: dto.clientId,
          clientType: dto.clientType,
        },
      ],
      city: dto.cityId,
    });

    await this.userRepository.persistAndFlush(user);

    return user;
  }

  async updateSettings(id: number, dto: UpdateUserSettingsDto) {
    const foundUser = await this.getBy({ id });

    if (dto.enabledNotifications) {
      foundUser.settings.enabledNotifications = dto.enabledNotifications;
    }

    if (dto.filters) {
      foundUser.settings.filters = dto.filters;
    }

    await this.userRepository.persistAndFlush(foundUser);

    return foundUser.settings;
  }

  async remove(id: number) {
    const foundUser = await this.getBy({ id });
    return this.userRepository.removeAndFlush(foundUser);
  }
}
