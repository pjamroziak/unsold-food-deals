import { AccessTokenAuthStrategy } from './access-token.auth-strategy';
import { EmailAuthStrategy } from './email.auth-strategy';

export * from './access-token.auth-strategy';
export * from './auth-strategy.interface';
export * from './email.auth-strategy';

export const strategies = [EmailAuthStrategy, AccessTokenAuthStrategy];
