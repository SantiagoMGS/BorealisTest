import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateReceptionDto {
  @ApiProperty({
    description: 'ID de la compañía',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  companyId!: string;

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
}
