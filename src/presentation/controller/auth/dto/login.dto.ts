import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IAuthLoginEntity } from '@domain/entities/auth-login.entity';

export class LoginDto implements IAuthLoginEntity {
  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password!: string;
}
