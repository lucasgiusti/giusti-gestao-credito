import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { CustomExceptionFilter } from './infraestructure/http/filters/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'fatal'],
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Giusti Gestão de Créditos')
    .setDescription('Giusti Gestão de Créditos')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new CustomExceptionFilter());
  
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();

  app.use(bodyParser.json({ limit: '15mb' }));
  app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));

  await app.listen(3000);
}
bootstrap();
