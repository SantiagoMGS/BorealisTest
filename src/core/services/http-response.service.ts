import { Injectable } from '@nestjs/common';

export interface HttpResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
}

@Injectable()
export class ResponseService {
  success<T>(
    data: T,
    message = 'Operación exitosa',
    statusCode = 200,
  ): HttpResponse<T> {
    return {
      statusCode,
      message,
      data,
    };
  }

  error(
    message = 'Error en la operación',
    statusCode = 400,
    error?: string,
  ): HttpResponse<null> {
    return {
      statusCode,
      message,
      error,
    };
  }
}
