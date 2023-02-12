import { ConfigType, registerAs } from '@nestjs/config';

export const apiClientConfig = registerAs('api-client-config', () => ({
  baseURL: process.env.API_CLIENT_BASE_URL,
}));

export type ApiClientConfig = ConfigType<typeof apiClientConfig>;
