import { Cascade, Collection, Entity, OneToMany } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { Client } from './client.entity';

@Entity()
export class User extends BaseEntity {
  @OneToMany({
    entity: () => Client,
    mappedBy: 'user',
    cascade: [Cascade.REMOVE],
  })
  clients = new Collection<Client>(this);
}
