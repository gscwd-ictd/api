import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const initializeOpenApiDocumentation = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('General Santos City Water District API Documentation')
    .setDescription('The quick brown fox jumps over a lazy dog near the riverbanks.')
    .setVersion('1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
