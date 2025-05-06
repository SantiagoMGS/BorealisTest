import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

// DTO para las unidades de recepción (items)
export class CreateSampleDto {
  @ApiProperty({
    description: 'ID del origen de recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  receptionOriginId!: string;

  @ApiProperty({
    description: 'Peso recibido',
    example: 1000.5,
  })
  @IsNumber()
  @IsNotEmpty()
  receivedWeight!: number;

  @ApiProperty({
    description: 'IDs de los tipos de análisis requeridos',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    required: true,
    type: [String],
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty({
    message:
      'Se requiere especificar al menos un tipo de análisis para cada muestra',
  })
  analysisTypeIds!: string[];
}

export class CreateReceptionDto {
  @ApiProperty({
    description: 'ID del proveedor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  supplierId!: string;

  @ApiProperty({
    description: 'ID del título minero',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  miningTitleId?: string;

  @ApiProperty({
    description: 'ID del municipio',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  cityId!: string;

  @ApiProperty({
    description: 'Fecha de recepción',
    example: '2023-10-15T14:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  receptionDate!: Date;

  @ApiProperty({
    description: 'Número de lote',
    example: 'L20231015-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({
    description: 'Observaciones',
    example: 'Material en buenas condiciones',
    required: false,
  })
  @IsString()
  @IsOptional()
  observation?: string;

  @ApiProperty({
    description: 'Unidades de recepción',
    type: [CreateSampleDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSampleDto)
  @IsNotEmpty()
  items!: CreateSampleDto[];
}
