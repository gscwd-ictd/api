/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  /**
   * initialize a nest application
   */

  /**
   * set application port
   */

  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<string>('SMS_PORT');

  app.enableCors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  /**
   * enable api versioning
   */
  app.enableVersioning({ type: VersioningType.URI });

  /**
   *  apply the global prefix
   */
  app.setGlobalPrefix('api/sms');

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api/sms`, 'SMS');
}

bootstrap();
