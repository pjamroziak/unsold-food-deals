import { ClientType } from '../api-client.types';

export type CreateUserPayload = {
  cityId: number;
  clientId: string;
  clientType: ClientType;
};
