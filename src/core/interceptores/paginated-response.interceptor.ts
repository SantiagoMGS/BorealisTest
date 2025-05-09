import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { IPaginatedData } from '../../shared/interfaces/pagination.interfaces';

@Injectable()
export class PaginatedResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data: any) => {
        // Verificamos si los datos tienen la estructura de paginación
        if (
          data &&
          typeof data === 'object' &&
          'items' in data &&
          'meta' in data
        ) {
          const paginatedData = data as IPaginatedData<T>;

          // Creamos la respuesta estandarizada con la estructura de paginación
          return {
            success: true,
            statusCode: response.statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: 'Datos recuperados exitosamente',
            data: {
              items: paginatedData.items,
              meta: paginatedData.meta,
            },
          };
        }

        // Si no es una respuesta paginada, la devolvemos como está
        // para que sea procesada por el ResponseInterceptor genérico
        return data;
      }),
    );
  }
}
