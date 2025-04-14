import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SwaggerResponses } from '../helpers/swagger-response';

export function ApiStandardResponses(options?: {
  ok?: string;
  created?: boolean;
  notFound?: string;
  badRequest?: boolean;
}) {
  const decorators = [
    ApiResponse(SwaggerResponses.Unauthorized),
    ApiResponse(SwaggerResponses.Forbidden),
  ];

  if (options?.ok) {
    decorators.push(ApiResponse(SwaggerResponses.Ok(options.ok)));
  }

  if (options?.created) {
    decorators.push(ApiResponse(SwaggerResponses.Created()));
  }

  if (options?.notFound) {
    decorators.push(ApiResponse(SwaggerResponses.NotFound(options.notFound)));
  }

  if (options?.badRequest) {
    decorators.push(ApiResponse(SwaggerResponses.BadRequest()));
  }

  return applyDecorators(...decorators);
}
