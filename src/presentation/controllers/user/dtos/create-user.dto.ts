import { ApiProperty } from '@nestjs/swagger';
import { permission } from 'process';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsUUID,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Pepito Perez', description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @ApiProperty({
    example: 'fabio@example.com',
    description: 'Correo del usuario',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario',
  })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  password: string;

  @ApiProperty({
    description: 'List of company IDs to assign to the user',
    example: [
      {
        companyId: '123e4567-e89b-12d3-a456-426614174001',
        roleId: '123e4567-e89b-12d3-a456-426614174002',
      },
      {
        companyId: '123e4567-e89b-12d3-a456-426614174003',
        roleId: '123e4567-e89b-12d3-a456-426614174004',
      },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        actionId: { type: 'string', format: 'uuid' },
        resourceId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @IsArray()
  @IsNotEmpty()
  permissions: { companyId: string; roleId: string }[];
}
