import {
  Cascade,
  Collection,
  Entity,
  Index,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { Client } from './client.entity';

@Entity()
@Index()
export class City extends BaseEntity {
  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'double' })
  latitude!: number;

  @Property({ type: 'double' })
  longitude!: number;

  @Property({ type: 'integer' })
  radiusInKm!: number;

  @OneToMany({
    entity: () => Client,
    mappedBy: 'city',
    cascade: [Cascade.PERSIST],
  })
  clients = new Collection<Client>(this);
}
