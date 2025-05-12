import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsArray, IsUUID } from 'class-validator';
import { PaginationDto } from '@shared/dtos/paginator.dto';

export class FindSampleByFiltersDto extends PaginationDto {
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
    description: 'IDs de proveedores para filtrar',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  supplierIds?: string[];

  @ApiProperty({
    description: 'IDs de orígenes de recepción para filtrar',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  receptionOriginIds?: string[];

  @ApiProperty({
    description: 'IDs de dorés para filtrar',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  sampleIds?: string[];
}
