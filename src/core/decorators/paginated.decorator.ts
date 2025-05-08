import { SetMetadata, applyDecorators, UseInterceptors } from '@nestjs/common';
import { PaginatedResponseInterceptor } from '../interceptores/paginated-response.interceptor';
import { ApiQuery } from '@nestjs/swagger';

export const PAGINATED_RESPONSE_METADATA = 'paginated_response';

/**
 * Decorador para marcar un método de controlador que devuelve una respuesta paginada
 * También configura automáticamente la documentación Swagger para los parámetros de paginación
 */
export function Paginated() {
  return applyDecorators(
    SetMetadata(PAGINATED_RESPONSE_METADATA, true),
    UseInterceptors(PaginatedResponseInterceptor),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número de página (por defecto: 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Cantidad de elementos por página (por defecto: 10)',
    }),
  );
}
