import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsArray, IsUUID } from 'class-validator';
import { PaginationDto } from '@shared/dtos/paginator.dto';
import { TransformCommaSeparated } from '@core/decorators/transform-comma-separated.decorator';
import { IManagementFilter } from '@domain/interfaces/management';

export class FindSampleByFiltersDto
  extends PaginationDto
  implements IManagementFilter
{
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
      '123e4567-e89b-12d3-a456-426614174000,456e7891-e89b-12d3-a456-426614174111',
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
      '123e4567-e89b-12d3-a456-426614174000,456e7891-e89b-12d3-a456-426614174111',
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
      'String con IDs de muestras separados por comas (deben ser UUIDs válidos)',
    example:
      '123e4567-e89b-12d3-a456-426614174000,456e7891-e89b-12d3-a456-426614174111',
    required: false,
    type: String,
  })
  @IsOptional()
  @TransformCommaSeparated()
  @IsArray()
  @IsUUID(4, { each: true })
  sampleIds?: string[];
}
