import { ConfigType, registerAs } from '@nestjs/config';

export const rabbitmqConfig = registerAs('rabbitmq', () => ({
  uri: process.env.RABBITMQ_URI,
}));

export const RabbitMQConfigKey = rabbitmqConfig.KEY;

export type RabbitMQConfig = ConfigType<typeof rabbitmqConfig>;
