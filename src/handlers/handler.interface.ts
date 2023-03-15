import { AsyncEvent } from '@app/services/event-publisher/async-event.interface';

export interface EventHandler {
  handle(event: AsyncEvent): void | Promise<void>;
}
