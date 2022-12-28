import { Logger } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';

async function bootstrap() {
  // initialize a nest application
  const app = await NestFactory.create<NestApplication>(AppModule);

  // set global prefix for endpoints
  const globalPrefix = 'api';

  // apply the global prefix
  app.setGlobalPrefix(globalPrefix);

  // intialize application port to listen to
  const port = process.env.IMS_PORT;

  // start the application
  await app.listen(port);

  // application logger
  Logger.log(`🚀 Inventory is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
