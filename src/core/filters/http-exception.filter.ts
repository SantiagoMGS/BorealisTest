// filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Reflector } from '@nestjs/core';
import {
  CUSTOM_RESPONSE_METADATA,
  CustomResponseOptions,
} from '../decorators/custom-response.decorator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private reflector: Reflector) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Intentar obtener el mensaje personalizado del decorador
    // En un filtro global es más difícil acceder al handler específico,
    // por lo que usaremos mensajes por defecto
    let errorMessage =
      typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? exceptionResponse['message']
        : exception.message;

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
      error:
        typeof exceptionResponse === 'object' && 'error' in exceptionResponse
          ? exceptionResponse['error']
          : HttpStatus[status],
      data: null,
    };

    reply.status(status).send(errorResponse);
  }
}
