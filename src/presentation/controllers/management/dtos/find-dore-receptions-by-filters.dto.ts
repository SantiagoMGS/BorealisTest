import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@shared/dtos/paginator.dto';
import { TransformCommaSeparated } from '@core/decorators/transform-comma-separated.decorator';

export class FindDoreReceptionsByFiltersDto extends PaginationDto {
  @ApiProperty({
    description: 'Fecha inicial para filtrar',
    example: '2023-01-01T00:00:00Z',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty({
    description: 'Fecha final para filtrar',
    example: '2023-12-31T23:59:59Z',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @ApiProperty({
    description:
      'String con IDs de proveedores separados por comas (deben ser UUIDs válidos)',
    example:
      '53c26f91-a056-4ced-be31-81f9f792f999,66666d74-b30c-4216-b85e-986c9b626abb',
    required: false,
    type: String,
  })
  @IsOptional()
  @TransformCommaSeparated()
  @IsArray()
  @IsUUID(4, { each: true })
  supplierIds?: string[];

  @ApiProperty({
    description:
      'String con IDs de orígenes de recepción separados por comas (deben ser UUIDs válidos)',
    example:
      '123e4567-e89b-12d3-a456-426614174000,123e4567-e89b-12d3-a456-426614174001',
    required: false,
    type: String,
  })
  @IsOptional()
  @TransformCommaSeparated()
  @IsArray()
  @IsUUID(4, { each: true })
  receptionOriginIds?: string[];

  @ApiProperty({
    description:
      'String con IDs de dorés separados por comas (deben ser UUIDs válidos)',
    example:
      '123e4567-e89b-12d3-a456-426614174000,123e4567-e89b-12d3-a456-426614174001',
    required: false,
    type: String,
  })
  @IsOptional()
  @TransformCommaSeparated()
  @IsArray()
  @IsUUID(4, { each: true })
  doreIds?: string[];

  @ApiProperty({
    description: 'String con números de lote separados por comas',
    example: 'LOTE-001,LOTE-002',
    required: false,
    type: String,
  })
  @IsOptional()
  @TransformCommaSeparated()
  @IsArray()
  batchNumbers?: string[];
}
