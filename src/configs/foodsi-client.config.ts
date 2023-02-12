import { ConfigType, registerAs } from '@nestjs/config';

export const foodsiClientConfig = registerAs('foodsi-client-config', () => ({
  baseUrl: process.env.FOODSI_BASE_URL,
  offersEndpoint: process.env.FOODSI_RESTAURANTS_API_URL,
  headers: {
    'Content-type': process.env.FOODSI_HEADER_CONTENT_TYPE,
    'system-version': process.env.FOODSI_HEADER_SYSTEM_VERSION,
    'user-agent': process.env.FOODSI_HEADER_USER_AGENT,
  },
  request: {
    distance: {
      range: Number(process.env.FOODSI_DISTANCE_RANGE),
    },
  },
}));

export type FoodsiClientConfig = ConfigType<typeof foodsiClientConfig>;
