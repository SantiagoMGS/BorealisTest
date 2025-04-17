import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
  })
  name!: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 401,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Credenciales incorrectas',
  })
  message!: string;

  @ApiProperty({
    description: 'Ruta que generó el error',
    example: '/auth/login',
  })
  path!: string;

  @ApiProperty({
    description: 'Marca de tiempo',
    example: '2023-01-01T00:00:00.000Z',
  })
  timestamp!: string;
}
