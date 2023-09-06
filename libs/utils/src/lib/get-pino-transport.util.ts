import 'pino-loki';
import 'pino-pretty';

type LokiConfig = {
  host: string;
  username: string;
  password: string;
};

export const getPinoPrettyTransport = () => {
  return { target: 'pino-pretty' };
};

export const getPinoLokiTransport = (config: LokiConfig) => {
  return {
    target: 'pino-loki',
    options: {
      silenceErrors: false,
      host: config.host,
      basicAuth: {
        username: config.username,
        password: config.password,
      },
    },
  };
};
