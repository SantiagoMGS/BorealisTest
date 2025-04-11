import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

export const SwaggerResponses = {
  Ok: (description = 'Operación exitosa'): ApiResponseOptions => ({
    status: HttpStatus.OK,
    description,
  }),
  Created: (description = 'Recurso creado exitosamente'): ApiResponseOptions => ({
    status: HttpStatus.CREATED,
    description,
  }),
  BadRequest: (description = 'Datos de entrada inválidos'): ApiResponseOptions => ({
    status: HttpStatus.BAD_REQUEST,
    description,
  }),
  Unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  },
  Forbidden: {
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  },
  NotFound: (description = 'Recurso no encontrado'): ApiResponseOptions => ({
    status: HttpStatus.NOT_FOUND,
    description,
  }),
  InternalServerError: (description = 'Error interno del servidor'): ApiResponseOptions => ({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description,
  }),
};
