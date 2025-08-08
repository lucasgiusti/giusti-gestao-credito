import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StructuredLoggerService } from '../../logging/structured-logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: StructuredLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, query, headers } = request;
    const requestId = uuidv4();
    const userId = request.user?.id || 'anonymous';
    
    this.logger.setContext({ requestId, userId });
    
    const startTime = Date.now();
    this.logger.log(`Request started: ${method} ${url}`, {
      method,
      url,
      body,
      params,
      query,
      userAgent: headers['user-agent'],
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          this.logger.log(`Request completed: ${method} ${url}`, {
            responseTime,
            statusCode: context.switchToHttp().getResponse().statusCode,
            responseSize: JSON.stringify(data ? data : '').length,
          });
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          this.logger.error(`Request failed: ${method} ${url}`, error.stack, {
            responseTime,
            statusCode: error.status || 500,
            errorName: error.name,
            errorMessage: error.message,
          });
        },
      }),
    );
  }
}