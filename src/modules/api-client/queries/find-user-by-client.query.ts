import { ClientType } from '../api-client.types';

export type FindUserByClientQuery = {
  clientType: ClientType;
  clientId: string;
};
