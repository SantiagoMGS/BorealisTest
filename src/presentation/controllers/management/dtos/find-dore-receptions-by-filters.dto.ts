import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@shared/dtos/paginator.dto';
import { TransformCommaSeparated } from '@core/decorators/transform-comma-separated.decorator';
import { IManagementFilter } from '@domain/interfaces/management';

export class FindDoreReceptionsByFiltersDto
  extends PaginationDto
  implements IManagementFilter
{
  @ApiProperty({
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty({
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @ApiProperty({
    description:
      'String con IDs de proveedores separados por comas (deben ser UUIDs válidos)',
    required: false,
  })
  @IsOptional()
  @TransformCommaSeparated()
  @IsArray()
  @IsUUID(4, { each: true })
  supplierIds?: string[];

  @ApiProperty({
    description:
      'String con IDs de orígenes de recepción separados por comas (deben ser UUIDs válidos)',
    required: false,
  })
  @IsOptional()
  @TransformCommaSeparated()
  @IsArray()
  @IsUUID(4, { each: true })
  receptionOriginIds?: string[];

  @ApiProperty({
    description:
      'String con IDs de dorés separados por comas (deben ser UUIDs válidos)',
    required: false,
  })
  @IsOptional()
  @TransformCommaSeparated()
  @IsArray()
  @IsUUID(4, { each: true })
  doreIds?: string[];

  @ApiProperty({
    description: 'String con números de lote separados por comas',
    required: false,
  })
  @IsOptional()
  @TransformCommaSeparated()
  @IsArray()
  batchNumbers?: string[];
}
