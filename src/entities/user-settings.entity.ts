import { ArrayType, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class UserSettings {
  @PrimaryKey()
  id!: number;

  @Property()
  enabledNotifications = true;

  @Property({ type: ArrayType })
  filters: string[] = [];

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
