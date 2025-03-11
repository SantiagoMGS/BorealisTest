import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Operario', description: 'Nombre de la compañía' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @ApiProperty({ example: 'logo.png', description: 'Nombre del logo' })
  @IsNotEmpty({ message: 'El logo es obligatorio' })
  @IsString({ message: 'El logo debe ser un texto' })
  logo: string;

  @ApiProperty({
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'Lista de IDs de aplicaciones asociadas',
    isArray: true,
  })
  @IsArray({ message: 'applicationIds debe ser un array de UUIDs' })
  @ArrayNotEmpty({ message: 'Debe haber al menos una aplicación asociada' })
  @IsUUID('4', { each: true, message: 'Cada applicationId debe ser un UUID válido' })
  applicationIds: string[];
}
