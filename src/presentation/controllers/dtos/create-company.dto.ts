import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {


  @ApiProperty({ example: 'Operario', description: 'Nombre de la compañia' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @ApiProperty({ example: 'Operario', description: 'Nombre del logo' })
  @IsNotEmpty({ message: 'El Logo es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  logo: string;
}