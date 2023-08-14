import { Token } from '../types';

export interface IAuthStrategy<P = unknown> {
  execute(payload: P): Token | Promise<Token>;
}
