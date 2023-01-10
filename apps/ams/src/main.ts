import { Logger, VersioningType } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';

async function bootstrap() {
  // initialize a nest application
  const app = await NestFactory.create<NestApplication>(AppModule);

  // enable cors policy
  app.enableCors();

  // add api url end point versioning
  app.enableVersioning({ type: VersioningType.URI });

  // set global prefix for endpoints
  const globalPrefix = 'api/assets';

  // apply the global prefix
  app.setGlobalPrefix(globalPrefix);

  // intialize application port to listen to
  const port = process.env.AMS_PORT;

  // start the application
  await app.listen(port);

  // application logger
  Logger.log(`🚀 Inventory is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
