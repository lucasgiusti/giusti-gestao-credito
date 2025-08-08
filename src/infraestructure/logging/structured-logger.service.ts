import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

export interface LogContext {
  useCase?: string;
  entity?: string;
  userId?: string;
  requestId?: string;
  [key: string]: any;
}

@Injectable()
export class StructuredLoggerService implements LoggerService {
  private logger: winston.Logger;
  private context: LogContext = {};

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      defaultMeta: { service: 'giusti-gestao-credito' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        // Você pode adicionar outros transportes como:
        // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  setContext(context: LogContext): this {
    this.context = { ...this.context, ...context };
    return this;
  }

  log(message: string, context?: LogContext): void {
    this.logger.info(message, { ...this.context, ...context });
  }

  error(message: string, trace?: string, context?: LogContext): void {
    this.logger.error(message, { trace, ...this.context, ...context });
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, { ...this.context, ...context });
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, { ...this.context, ...context });
  }

  verbose(message: string, context?: LogContext): void {
    this.logger.verbose(message, { ...this.context, ...context });
  }
}