import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DocumentType } from '@prisma/client';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Minería Santa Rosa',
  })
  @IsNotEmpty({ message: 'El nombre del proveedor es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  name!: string;

  @ApiProperty({
    description: 'Tipo de documento del proveedor',
    enum: DocumentType,
    example: DocumentType.NIT,
  })
  @IsNotEmpty({ message: 'El tipo de documento es requerido' })
  @IsEnum(DocumentType, { message: 'Tipo de documento no válido' })
  documentType!: DocumentType;

  @ApiProperty({
    description: 'Número de documento del proveedor',
    example: '900123456',
  })
  @IsNotEmpty({ message: 'El número de documento es requerido' })
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @MinLength(5, {
    message: 'El número de documento debe tener al menos 5 caracteres',
  })
  @MaxLength(20, {
    message: 'El número de documento no puede exceder los 20 caracteres',
  })
  documentNumber!: string;
}
