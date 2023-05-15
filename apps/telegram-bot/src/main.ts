import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(PinoLogger));

  Logger.log(`🚀 Application is running`);
}

bootstrap();
