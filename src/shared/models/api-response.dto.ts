// src/shared/models/api-response.base.dto.ts
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO base para todas las respuestas de la API
 */
export class ApiResponseBaseDto<T = any> {
  @ApiProperty({
    description: 'Indicador de éxito de la operación',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Fecha y hora de la respuesta',
    example: '2025-05-16T19:00:58.615Z',
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Ruta de la petición',
    example: '/api/analyses/moisture-determination',
  })
  path!: string;

  @ApiProperty({
    description: 'Mensaje descriptivo',
    example: 'Operación exitosa',
  })
  message!: string;

  @ApiProperty({
    description: 'Datos de la respuesta',
    nullable: true,
  })
  data!: T;
}

export class SuccessResponseDto<T = any> extends ApiResponseBaseDto<T> {
  @ApiProperty({
    description: 'Indicador de éxito',
    example: true,
  })
  success: boolean = true;
}

export class ErrorResponseDto extends ApiResponseBaseDto<null> {
  @ApiProperty({
    description: 'Indicador de éxito',
    example: false,
  })
  success: boolean = false;

  @ApiProperty({
    description: 'Tipo de error',
    example: 'BAD_REQUEST',
  })
  error!: string;

  @ApiProperty({
    description: 'Datos adicionales',
    example: null,
  })
  data: null = null;
}
