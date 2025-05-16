import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import {
  CUSTOM_RESPONSE_METADATA,
  CustomResponseOptions,
} from '../decorators/custom-response.decorator';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Obtener metadatos del decorador si existen
    const customOptions = this.reflector.get<CustomResponseOptions>(
      CUSTOM_RESPONSE_METADATA,
      context.getHandler(),
    );

    // Mensaje de éxito predeterminado o personalizado
    const successMessage = customOptions?.successMessage || 'Operación exitosa';

    return next.handle().pipe(
      map((data) => {
        // Si ya es un objeto con una estructura específica, respetamos esa estructura
        if (data && typeof data === 'object' && 'success' in data) {
          return {
            ...data,
            message: data.message || successMessage,
          };
        }

        // Si no, creamos una estructura estandarizada
        return {
          success: true,
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: successMessage,
          data: data,
        };
      }),
    );
  }
}
