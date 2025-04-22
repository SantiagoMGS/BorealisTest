import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { DocumentType } from '@prisma/client';

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
    description: 'Tipo de documento del proveedor',
    enum: DocumentType,
    example: DocumentType.NIT,
    required: false,
  })
  @IsOptional()
  @IsEnum(DocumentType, { message: 'Tipo de documento no válido' })
  documentType?: DocumentType;

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
