import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  name!: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Estado del usuario (activo/inactivo)',
    example: true,
  })
  isActive!: boolean;

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
