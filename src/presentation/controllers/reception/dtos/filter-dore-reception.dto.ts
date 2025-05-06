import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterDoreReceptionDto {
  @ApiProperty({
    description: 'Fecha de inicio para filtrar recepciones',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    description: 'Fecha de fin para filtrar recepciones',
    example: '2023-12-31T23:59:59Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    description: 'ID del proveedor',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @ApiProperty({
    description: 'Código de recepción o proveedor',
    example: 'COD001',
    required: false,
  })
  @IsString()
  @IsOptional()
  code?: string;
}
