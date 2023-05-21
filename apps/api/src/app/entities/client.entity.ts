import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { User } from './user.entity';
import { ClientType } from '@unsold-food-deals/schemas';
import { City } from './city.entity';

@Entity()
export class Client extends BaseEntity {
  @Property()
  chatId!: string;

  @Enum(() => ClientType)
  type!: ClientType;

  @Property()
  enabled!: boolean;

  @ManyToOne({
    entity: () => City,
    serializer: (value) => (value ? value.id : undefined),
  })
  city?: City;

  @ManyToOne({
    entity: () => User,
    serializer: (value) => (value ? value.id : undefined),
  })
  user?: User;
}
