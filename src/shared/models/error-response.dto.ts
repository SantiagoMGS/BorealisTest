import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 401,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Operación no autorizada',
  })
  message!: string;

  @ApiProperty({
    description: 'Ruta que generó el error',
    example: '/api/resource',
  })
  path!: string;

  @ApiProperty({
    description: 'Marca de tiempo',
    example: '2023-01-01T00:00:00.000Z',
  })
  timestamp!: string;
}
