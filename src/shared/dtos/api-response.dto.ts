import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para documentar la estructura estandarizada de respuesta de la API
 * Se usa con @ApiExtraModels y @ApiResponse para mostrar correctamente los schemas en Swagger
 */
export class ApiResponseDto<T> {
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
    example: '2025-05-09T12:54:51.437Z',
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Ruta de la petición',
    example: '/api/dore-receptions/dropdown-data',
  })
  path!: string;

  @ApiProperty({
    description: 'Mensaje descriptivo de la operación',
    example: 'Operación exitosa',
  })
  message!: string;

  @ApiProperty({
    description: 'Datos de la respuesta',
    type: 'object',
    additionalProperties: {},
  })
  data!: T;
}

/**
 * Función para crear un schema de respuesta API para Swagger
 * @param dataDto El DTO que representa la estructura de datos
 * @returns Un objeto de configuración para usar con @ApiResponse
 */
export function getResponseSchema(dataDto: any) {
  return {
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponseDto' },
        {
          properties: {
            data: {
              $ref: `#/components/schemas/${dataDto.name}`,
            },
          },
        },
      ],
    },
  };
}

/**
 * Función para crear un schema de respuesta API para arrays en Swagger
 * @param itemDto El DTO que representa cada elemento del array
 * @returns Un objeto de configuración para usar con @ApiResponse
 */
export function getArrayResponseSchema(itemDto: any) {
  return {
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponseDto' },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: `#/components/schemas/${itemDto.name}` },
            },
          },
        },
      ],
    },
  };
}

/**
 * Función para crear un schema de respuesta API para arrays de tipos primitivos
 * @param itemSchema El schema que define cada elemento del array (tipo primitivo)
 * @returns Un objeto de configuración para usar con @ApiResponse
 */
export function getPrimitiveArrayResponseSchema(itemSchema: any) {
  return {
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponseDto' },
        {
          properties: {
            data: {
              type: 'array',
              items: itemSchema,
            },
          },
        },
      ],
    },
  };
}
