import {
  Cascade,
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from './user.entity';

export enum ClientType {
  TELEGRAM = 'telegram',
}

@Entity()
export class Client {
  @PrimaryKey()
  id!: number;

  @Property()
  clientId!: string;

  @Enum(() => ClientType)
  clientType!: ClientType;

  @ManyToOne({ onDelete: 'cascade', cascade: [Cascade.REMOVE] })
  user!: User;
}
