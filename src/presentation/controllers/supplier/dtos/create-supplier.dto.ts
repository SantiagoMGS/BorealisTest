import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsUUID,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

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
    description: 'ID del tipo de documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del tipo de documento es requerido' })
  @IsUUID('4', {
    message: 'El ID del tipo de documento debe ser un UUID válido',
  })
  documentTypeId!: string;

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

  @ApiProperty({
    description: 'Dígito de verificación (para documentos tipo NIT)',
    example: 9,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El dígito de verificación debe ser un número entero' })
  @Min(0, { message: 'El dígito de verificación debe ser mayor o igual a 0' })
  @Max(9, { message: 'El dígito de verificación debe ser menor o igual a 9' })
  verificationDigit?: number;
}
