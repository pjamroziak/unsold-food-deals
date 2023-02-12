import { ConfigType, registerAs } from '@nestjs/config';

export const dbConfig = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
}));

export type DatabaseConfig = ConfigType<typeof dbConfig>;
