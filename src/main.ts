require('newrelic');
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const config = new ConfigService();
  const port = Number(config.get('APP_PORT'));

  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter({ ignoreTrailingSlash: true }),
    { bufferLogs: true },
  );
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(port, '0.0.0.0');
}
bootstrap().catch(console.error);
