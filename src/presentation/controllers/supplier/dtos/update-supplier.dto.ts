import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class UpdateSupplierDto {
  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Minería Santa Rosa',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'ID del tipo de documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', {
    message: 'El ID del tipo de documento debe ser un UUID válido',
  })
  documentTypeId?: string;

  @ApiProperty({
    description: 'Número de documento del proveedor',
    example: '900123456',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @MinLength(5, {
    message: 'El número de documento debe tener al menos 5 caracteres',
  })
  @MaxLength(20, {
    message: 'El número de documento no puede exceder los 20 caracteres',
  })
  documentNumber?: string;

  @ApiProperty({
    description: 'Estado del proveedor',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  isActive?: boolean;
}
