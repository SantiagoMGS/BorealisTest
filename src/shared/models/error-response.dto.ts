// src/shared/models/error-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para documentar la estructura de errores de la API en Swagger
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Indicador de éxito de la operación',
    example: false,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400,
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
    description: 'Mensaje descriptivo del error',
    example: 'Error en la operación',
  })
  message!: string;

  @ApiProperty({
    description: 'Tipo de error',
    example: 'BAD_REQUEST',
  })
  error!: string;

  @ApiProperty({
    description: 'Datos adicionales',
    example: null,
    nullable: true,
  })
  data!: any;
}
