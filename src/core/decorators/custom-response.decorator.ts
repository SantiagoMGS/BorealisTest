import { applyDecorators, SetMetadata } from '@nestjs/common';

export interface CustomResponseOptions {
  successMessage?: string;
  errorMessage?: string;
}

export const CUSTOM_RESPONSE_METADATA = 'custom_response_metadata';

export function CustomResponse(options: CustomResponseOptions) {
  return applyDecorators(SetMetadata(CUSTOM_RESPONSE_METADATA, options));
}
