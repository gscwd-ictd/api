import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3333;

  await app.listen(port);

  Logger.log(`🚀 IMS Microservice is listening on port ${port}`);
}

bootstrap();
