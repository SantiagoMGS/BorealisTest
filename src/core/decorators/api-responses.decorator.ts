// src/core/decorators/api-responses.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '@shared/dtos/api-response.dto';

interface ErrorExample {
  message: string;
  description?: string;
}

export function ApiPaginatedResponse<T extends Type<any>>(
  description: string,
  itemType: T,
) {
  return applyDecorators(
    ApiExtraModels(itemType, ApiResponseDto),
    ApiResponse({
      status: 200,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              success: { type: 'boolean', example: true },
              statusCode: { type: 'number', example: 200 },
              timestamp: { type: 'string', example: new Date().toISOString() },
              path: {
                type: 'string',
                example: '/api/sample-management/find-by-filters',
              },
              message: { type: 'string', example: description },
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(itemType) },
                  },
                  meta: {
                    type: 'object',
                    properties: {
                      page: { type: 'number', example: 1 },
                      limit: { type: 'number', example: 10 },
                      total: { type: 'number', example: 100 },
                      totalPages: { type: 'number', example: 10 },
                      hasNextPage: { type: 'boolean', example: true },
                      hasPreviousPage: { type: 'boolean', example: false },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
}

export function ApiSuccessResponse<T extends Type<any>>(
  status: number = 200,
  description: string,
  dataType: T,
) {
  return applyDecorators(
    ApiExtraModels(dataType, ApiResponseDto),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              success: { type: 'boolean', example: true },
              statusCode: { type: 'number', example: status },
              timestamp: { type: 'string', example: new Date().toISOString() },
              path: { type: 'string', example: '/api/example-path' },
              message: { type: 'string', example: description },
              data: { $ref: getSchemaPath(dataType) },
            },
          },
        ],
      },
    }),
  );
}

export function ApiSuccessResponseWithExample<T extends Type<any>>(
  status: number = 200,
  description: string,
  dataType: T,
  customExample: any,
) {
  return applyDecorators(
    ApiExtraModels(dataType),
    ApiResponse({
      status,
      description,
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  data: { $ref: getSchemaPath(dataType) },
                  message: { example: description },
                },
              },
            ],
          },
          example: {
            success: true,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: '/api/example-path',
            message: description,
            data: customExample,
          },
        },
      },
    }),
  );
}

export function ApiNoContentResponse(
  description: string = 'No hay contenido para mostrar',
) {
  return applyDecorators(
    ApiResponse({
      status: 204,
      description,
      content: {
        'application/json': {
          example: {
            success: true,
            statusCode: 204,
            timestamp: new Date().toISOString(),
            path: '/api/example-path',
            message: description,
            data: null,
          },
        },
      },
    }),
  );
}

/**
 * Decorador para documentar una respuesta de error con formato estándar
 */
export function ApiErrorResponse(
  statusCode: number,
  errorType: string,
  message: string,
) {
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponseDto' },
          example: {
            success: false,
            statusCode: statusCode,
            timestamp: new Date().toISOString(),
            path: '/api/example-path',
            message: message,
            error: errorType,
            data: null,
          },
        },
      },
    }),
  );
}

export function ApiMultipleErrors(
  statusCode: number,
  errorType: string,
  errors: ErrorExample[],
) {
  const examples = errors.reduce((acc: any, error, index) => {
    acc[`error${index + 1}`] = {
      value: {
        success: false,
        statusCode: statusCode,
        timestamp: new Date().toISOString(),
        path: '/api/example-path',
        message: error.message,
        error: errorType,
        data: null,
      },
      description: error.description || error.message,
    };
    return acc;
  }, {});

  return applyDecorators(
    ApiResponse({
      status: statusCode,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponseDto' },
          examples: examples,
        },
      },
    }),
  );
}
