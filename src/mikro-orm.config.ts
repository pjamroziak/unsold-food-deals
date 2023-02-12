import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { ConfigService } from '@nestjs/config';

const getConfig = (): Options => {
  const configService = new ConfigService();

  return {
    host: configService.get('POSTGRES_HOST'),
    port: Number(configService.get('POSTGRES_PORT')),
    user: configService.get('POSTGRES_USERNAME'),
    password: configService.get('POSTGRES_PASSWORD'),
    dbName: configService.get('POSTGRES_NAME'),
    type: 'postgresql',
    entities: ['./dist/entities/**/*.js'],
    entitiesTs: ['./entities/**/*.ts'],
    migrations: {
      snapshot: false,
    },
    metadataProvider: TsMorphMetadataProvider,
  };
};

export default getConfig();
