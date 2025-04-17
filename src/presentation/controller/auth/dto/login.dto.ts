import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ILoginEntity } from '@domain/entities/login.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto implements ILoginEntity {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123',
    required: true,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password!: string;
}
