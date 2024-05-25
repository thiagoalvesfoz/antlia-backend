import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function configureSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Projeto Antlia')
    .setDescription('Antlia API')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api-docs', app, document);
}
