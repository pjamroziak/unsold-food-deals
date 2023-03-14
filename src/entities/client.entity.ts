import { ClientRepository } from '@app/api/repositories/client.repository';
import {
  Cascade,
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from './user.entity';

export enum ClientType {
  TELEGRAM = 'telegram',
}

@Entity({ customRepository: () => ClientRepository })
export class Client {
  [EntityRepositoryType]?: ClientRepository;

  @PrimaryKey()
  id!: number;

  @Property()
  clientId!: string;

  @Enum(() => ClientType)
  clientType!: ClientType;

  @ManyToOne({ onDelete: 'cascade', cascade: [Cascade.REMOVE] })
  user!: User;
}
