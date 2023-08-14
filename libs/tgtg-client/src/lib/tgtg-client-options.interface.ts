export interface EmailAuthOptions {
  email: string;
  maxRetries: number;
}

export interface AccessTokenAuthOptions {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export interface TooGoodToGoClientOptions {
  auth: EmailAuthOptions | AccessTokenAuthOptions;
}
