import { Logger, VersioningType } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';

async function bootstrap() {
  // initialize a nest application
  const app = await NestFactory.create<NestApplication>(AppModule);

  app.enableCors();

  app.enableVersioning({ type: VersioningType.URI });

  // set global prefix for endpoints
  const globalPrefix = 'api/finance';

  // apply the global prefix
  app.setGlobalPrefix(globalPrefix);

  // intialize application port to listen to
  const port = process.env.FINANCE_PORT;

  // start the application
  await app.listen(port);

  // application logger
  Logger.log(`🚀 Finance is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
