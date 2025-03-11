import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MinLength, IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'John Doe', description: 'Nombre del usuario', required: false })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  name?: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'Correo del usuario', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email?: string;

  @ApiProperty({ example: 'newpassword123', description: 'Nueva contraseña', required: false })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @ApiProperty({ example: true, description: 'Estado del usuario', required: false })
  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un booleano' })
  isActive?: boolean;
}
