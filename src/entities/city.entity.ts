import { Cordinates } from '@app/common/types';
import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class City {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({
    columnType: 'float8',
  })
  latitude!: number;

  @Property({
    columnType: 'float8',
  })
  longitude!: number;

  @Property({ persist: false })
  get cordinates(): Cordinates {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }

  @Property()
  radius!: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => User, (user) => user.city)
  users = new Collection<User>(this);
}
