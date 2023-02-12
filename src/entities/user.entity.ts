import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { City } from './city.entity';
import { Client } from './client.entity';
import { UserSettings } from './user-settings.entity';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToOne({ onDelete: 'cascade', cascade: [Cascade.REMOVE] })
  settings = new UserSettings();

  @OneToMany(() => Client, (client) => client.user, {
    cascade: [Cascade.PERSIST],
  })
  clients = new Collection<Client>(this);

  @ManyToOne()
  city!: City;
}
