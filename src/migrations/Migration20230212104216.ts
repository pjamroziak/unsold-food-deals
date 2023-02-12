import { Migration } from '@mikro-orm/migrations';

export class Migration20230212104216 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "city" ("id" serial primary key, "name" varchar(255) not null, "latitude" float8 not null, "longitude" float8 not null, "radius" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );

    this.addSql(
      'create table "user_settings" ("id" serial primary key, "enabled_notifications" boolean not null default true, "filters" text[] not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );

    this.addSql(
      'create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "settings_id" int null, "city_id" int not null);',
    );
    this.addSql(
      'alter table "user" add constraint "user_settings_id_unique" unique ("settings_id");',
    );

    this.addSql(
      'create table "client" ("id" serial primary key, "client_id" varchar(255) not null, "client_type" text check ("client_type" in (\'telegram\')) not null, "user_id" int null);',
    );

    this.addSql(
      'alter table "user" add constraint "user_settings_id_foreign" foreign key ("settings_id") references "user_settings" ("id") on delete cascade;',
    );
    this.addSql(
      'alter table "user" add constraint "user_city_id_foreign" foreign key ("city_id") references "city" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "client" add constraint "client_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;',
    );
  }
}
