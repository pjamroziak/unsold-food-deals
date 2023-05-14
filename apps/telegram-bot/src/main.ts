import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'redis';
import 'class-validator';

import { AppModule } from './app/app.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
  Logger.log(`🚀 Application is running`);
}

bootstrap();
