import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, IsUUID, IsHexColor } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ 
    example: 'Empresa S.A.', 
    description: 'Nombre de la compañía',
    required: true 
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @ApiProperty({ 
    example: 'logo.png', 
    description: 'Nombre del logo',
    required: true 
  })
  @IsNotEmpty({ message: 'El logo es obligatorio' })
  @IsString({ message: 'El logo debe ser un texto' })
  logo: string;

  @ApiProperty({
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'Lista de IDs de aplicaciones asociadas',
    isArray: true,
    required: true
  })
  @IsArray({ message: 'applicationIds debe ser un array de UUIDs' })
  @ArrayNotEmpty({ message: 'Debe haber al menos una aplicación asociada' })
  @IsUUID('4', { each: true, message: 'Cada applicationId debe ser un UUID válido' })
  applicationIds: string[];

  @ApiProperty({ 
    example: '#FFFFFF', 
    description: 'Color primario de la compañía',
    required: true 
  })
  @IsNotEmpty({ message: 'El color primario es obligatorio' })
  @IsString({ message: 'El color primario debe ser un texto' })
  @IsHexColor({ message: 'El color primario debe ser un código hexadecimal válido' })
  primaryColor: string;

  @ApiProperty({ 
    example: '#000000', 
    description: 'Color secundario de la compañía',
    required: true 
  })
  @IsNotEmpty({ message: 'El color secundario es obligatorio' })
  @IsString({ message: 'El color secundario debe ser un texto' })
  @IsHexColor({ message: 'El color secundario debe ser un código hexadecimal válido' })
  secondaryColor: string;

  @ApiProperty({ 
    example: '#FF0000', 
    description: 'Color terciario de la compañía',
    required: true 
  })
  @IsNotEmpty({ message: 'El color terciario es obligatorio' })
  @IsString({ message: 'El color terciario debe ser un texto' })
  @IsHexColor({ message: 'El color terciario debe ser un código hexadecimal válido' })
  thirdColor: string;
}