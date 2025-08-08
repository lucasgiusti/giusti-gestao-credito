import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { CustomExceptionFilter } from './infraestructure/http/filters/custom-exception.filter';
import { LoggingInterceptor } from './infraestructure/http/interceptors/logging.interceptor';
import { StructuredLoggerService } from './infraestructure/logging/structured-logger.service';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'debug', 'verbose', 'log'],
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

    const logger = app.get(StructuredLoggerService);

    app.useGlobalFilters(new CustomExceptionFilter(logger));
    app.useGlobalInterceptors(new LoggingInterceptor(logger));
    
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.enableCors();

    app.use(bodyParser.json({ limit: '15mb' }));
    app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));

    await app.listen(3000);
    console.log('Application is running on: http://localhost:3000');
  } catch (error) {
    console.error('Failed to start application:', error);
  }
}
bootstrap();
