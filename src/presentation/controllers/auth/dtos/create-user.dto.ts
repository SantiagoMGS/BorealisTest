import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsString, IsUUID, IsBoolean } from 'class-validator';

export class CreateUserDto {

  @IsUUID(4, { message: 'El id debe ser un UUID' })
  id: string; 

  @ApiProperty({ example: 'Fabio Sánchez', description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @ApiProperty({ example: 'fabio@example.com', description: 'Correo del usuario' })
  @IsEmail({}, { message: 'El email debe ser válido' }) // ✅ Asegurar que la validación está aquí
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}