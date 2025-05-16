import {
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PrinterConfigDto } from './printer-config.dto';

export class PrintLabelDto {
  @ApiProperty({
    description: 'Texto simple para imprimir',
    example: 'Producto: Mango\nPrecio: $2.50\nCantidad: 5kg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El texto debe ser una cadena de caracteres' })
  @MaxLength(1000, { message: 'El texto no puede exceder 1000 caracteres' })
  text?: string;

  @ApiProperty({
    description: 'Título para etiquetas complejas',
    example: 'PRODUCTO: MANGO',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El título debe ser una cadena de caracteres' })
  @MaxLength(100, { message: 'El título no puede exceder 100 caracteres' })
  title?: string;

  @ApiProperty({
    description: 'Líneas de texto adicionales',
    example: ['Precio: $2.50/kg', 'Cantidad: 5kg', 'Total: $12.50'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Las líneas deben ser un arreglo de cadenas' })
  @IsString({
    each: true,
    message: 'Cada línea debe ser una cadena de caracteres',
  })
  @MaxLength(100, {
    each: true,
    message: 'Cada línea no puede exceder 100 caracteres',
  })
  lines?: string[];

  @ApiProperty({
    description: 'Código de barras a generar',
    example: '7501234567890',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'El código de barras debe ser una cadena de caracteres',
  })
  @MaxLength(50, {
    message: 'El código de barras no puede exceder 50 caracteres',
  })
  barcode?: string;

  @ApiProperty({
    description: 'Código QR a generar',
    example: 'https://miempresa.com/producto/mango',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El código QR debe ser una cadena de caracteres' })
  @MaxLength(255, { message: 'El código QR no puede exceder 255 caracteres' })
  qrCode?: string;

  @ApiProperty({
    description: 'Si se debe omitir la prueba de conexión',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'skipConnectionTest debe ser un valor booleano' })
  skipConnectionTest?: boolean;

  @ApiProperty({
    description: 'Configuración personalizada de impresora',
    type: () => PrinterConfigDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PrinterConfigDto)
  printerConfig?: PrinterConfigDto;

  @ApiProperty({
    description: 'Nombre de la compañía para mostrar en la etiqueta',
    example: 'Mi Empresa S.A.',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'El nombre de la compañía debe ser una cadena de caracteres',
  })
  @MaxLength(50, {
    message: 'El nombre de la compañía no puede exceder 50 caracteres',
  })
  companyName?: string;
}
