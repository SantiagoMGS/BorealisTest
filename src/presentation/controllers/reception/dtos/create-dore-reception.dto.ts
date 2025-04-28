import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

// DTO para los ítems de doré
export class CreateDoreItemDto {
  @ApiProperty({
    description: 'Peso recibido',
    example: 1000.5,
  })
  @IsNumber()
  @IsNotEmpty()
  receivedWeight!: number;

  @ApiProperty({
    description: 'Observaciones del doré',
    example: 'Doré en buenas condiciones',
    required: false,
  })
  @IsString()
  @IsOptional()
  observation?: string;
}

export class CreateDoreReceptionDto {
  @ApiProperty({
    description: 'ID del proveedor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  supplierId!: string;

  @ApiProperty({
    description: 'ID del tipo de recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  receptionTypeId!: string;

  @ApiProperty({
    description: 'ID del origen de recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  receptionOriginId!: string;

  @ApiProperty({
    description: 'Fecha de recepción',
    example: '2023-10-15T14:30:00Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  receptionDate?: Date;

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
    description: 'Ítems de doré',
    type: [CreateDoreItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDoreItemDto)
  @IsNotEmpty()
  items!: CreateDoreItemDto[];
}
