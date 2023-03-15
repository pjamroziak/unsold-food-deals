import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { AsyncEvent } from './async-event.interface';

@Injectable()
export class EventPublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  publish(event: AsyncEvent) {
    this.amqpConnection.publish('events', event.name, event);
  }
}
