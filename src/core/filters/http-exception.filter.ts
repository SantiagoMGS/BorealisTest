// filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Reflector } from '@nestjs/core';
import {
  CUSTOM_RESPONSE_METADATA,
  CustomResponseOptions,
} from '../decorators/custom-response.decorator';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private reflector: Reflector) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    let status: number;
    let errorMessage: string;
    let errorType: string;

    if (exception instanceof HttpException) {
      // Si ya es una HttpException, mantener su estado y mensaje
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      errorMessage =
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? String(exceptionResponse['message'])
          : exception.message;
      errorType = HttpStatus[status];
    } else {
      // Para errores que no son HttpException
      this.logger.error(
        exception instanceof Error ? exception.message : 'Error desconocido',
        exception instanceof Error ? exception.stack : undefined,
      );

      // Manejar errores específicos
      if (exception instanceof Error) {
        if (exception.message === 'Recepción no encontrada') {
          status = HttpStatus.NOT_FOUND;
          errorMessage = exception.message;
          errorType = 'Not Found';
        } else if (exception.message === 'No tienes acceso a esta recepción') {
          status = HttpStatus.FORBIDDEN;
          errorMessage = exception.message;
          errorType = 'Forbidden';
        } else {
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          errorMessage = exception.message;
          errorType = 'Internal Server Error';
        }
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Error interno del servidor';
        errorType = 'Internal Server Error';
      }
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
      error: errorType,
      data: null,
    };

    reply.status(status).send(errorResponse);
  }
}
