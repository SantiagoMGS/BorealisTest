import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString, IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Pepito Perez', description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @ApiProperty({ example: 'fabio@example.com', description: 'Correo del usuario' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  password: string;

  @ApiProperty({
    example: ['550e8400-e29b-41d4-a716-446655440000', '123e4567-e89b-12d3-a456-426614174000'],
    description: 'IDs de las compañías a las que pertenece el usuario',
    isArray: true,
  })
  @IsArray({ message: 'companyIds debe ser un array de UUIDs' })
  @ArrayNotEmpty({ message: 'Debe haber al menos una compañía asociada' })
  @IsUUID('4', { each: true, message: 'Cada companyId debe ser un UUID válido' })
  companyIds: string[];
}
