export type City = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  users: User[];
};

export type Client = {
  clientType: ClientType;
  clientId: string;
};

export type UserSettings = {
  id: number;
  enabledNotifications: boolean;
  filters: string[];
};

export type User = {
  id: number;
  settings: UserSettings;
  clients: Client[];
  city: number;
};

export enum ClientType {
  Telegram = 'telegram',
}
