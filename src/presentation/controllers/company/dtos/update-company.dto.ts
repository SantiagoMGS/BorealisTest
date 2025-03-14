import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsArray, ArrayMinSize, IsHexColor } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID de la compañía',
    required: false
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID debe ser un UUID válido' })
  id?: string;

  @ApiProperty({
    example: 'Nueva Empresa S.A.',
    description: 'Nombre de la compañía',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  name?: string;

  @ApiProperty({
    example: 'nuevo-logo.png',
    description: 'Nombre del logo',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'El logo debe ser un texto' })
  logo?: string;

  @ApiProperty({
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'Lista de IDs de aplicaciones asociadas',
    required: false,
    isArray: true
  })
  @IsOptional()
  @IsArray({ message: 'applicationIds debe ser un array de UUIDs' })
  @IsUUID('4', { each: true, message: 'Cada applicationId debe ser un UUID válido' })
  applicationIds?: string[];

  @ApiProperty({
    example: '#FFFFFF',
    description: 'Color primario de la compañía',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'El color primario debe ser un texto' })
  @IsHexColor({ message: 'El color primario debe ser un código hexadecimal válido' })
  primaryColor?: string;

  @ApiProperty({
    example: '#000000',
    description: 'Color secundario de la compañía',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'El color secundario debe ser un texto' })
  @IsHexColor({ message: 'El color secundario debe ser un código hexadecimal válido' })
  secondaryColor?: string;

  @ApiProperty({
    example: '#FF0000',
    description: 'Color terciario de la compañía',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'El color terciario debe ser un texto' })
  @IsHexColor({ message: 'El color terciario debe ser un código hexadecimal válido' })
  thirdColor?: string;
}