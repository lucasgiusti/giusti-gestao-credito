import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { HttpStatusDescriptions } from './http-status-descriptions';
import { StructuredLoggerService } from '../../logging/structured-logger.service';
import { ValidationError } from '../../../application/errors/validation.error';


@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: StructuredLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    
    
    let messages: string[] = [];
    let customStatus = status;

    // Tratar ValidationError específico
    if (exception instanceof ValidationError) {
      messages = exception.errors;
      
      // Determinar o status com base no primeiro erro
      if (messages.length > 0) {
        const firstMessage = messages[0];
        const messageType = firstMessage.split('.')[0];
        
        switch (messageType) {
          case 'invalid':
            customStatus = HttpStatus.BAD_REQUEST; // 400
            break;
          case 'notfound':
            customStatus = HttpStatus.NOT_FOUND; // 404
            break;
          case 'unauthorized':
            customStatus = HttpStatus.UNAUTHORIZED; // 401
            break;
          default:
            customStatus = status;
            break;
        }
      }
    } else {
      // Tratamento padrão para outros tipos de erro
      const message = exception?.response?.message || exception.message || '';
      
      if (typeof message === 'string') {
        const messageType = message.split('.')[0];
       
        switch (messageType) {
          case 'invalid':
            customStatus = HttpStatus.BAD_REQUEST; // 400
            break;
          case 'notfound':
            customStatus = HttpStatus.NOT_FOUND; // 404
            break;
          case 'Unauthorized':
            customStatus = HttpStatus.UNAUTHORIZED; // 401
            break;
          case 'unauthorized':
            customStatus = HttpStatus.UNAUTHORIZED; // 401
            break;
          default:
            customStatus = status;
            break;
        }

        messages = [message];
      }
      else {
        if(message?.toString().includes('Unauthorized')) {
          messages = ['Unauthorized'];
          customStatus = HttpStatus.UNAUTHORIZED; // 401
        } else {
          messages = [message?.toString() || 'Erro interno do servidor'];
        }
      }
    }

    this.logger.error(`Erro capturado: ${messages.join(', ')}`, exception.stack, {
      path: request.url,
      method: request.method,
      statusCode: customStatus,
      errorType: exception.name,
      errorDetails: exception.response,
    });

    const statusDescription = HttpStatusDescriptions[customStatus] || 'Unknown Status';

    response.status(customStatus).json({
      messages: messages,
      error: statusDescription,
      statusCode: customStatus,
    });
  }
}