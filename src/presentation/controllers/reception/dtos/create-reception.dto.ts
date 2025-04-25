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
export class CreateReceptionUnitDto {
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
  recievedWeight!: number;

  @ApiProperty({
    description: 'Peso seco',
    example: 950.2,
  })
  @IsNumber()
  @IsNotEmpty()
  dryWeight!: number;
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
    description: 'ID del tipo de recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  receptionTypeId!: string;

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
    type: [CreateReceptionUnitDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReceptionUnitDto)
  @IsNotEmpty()
  items!: CreateReceptionUnitDto[];
}
