import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class DropdownDataDto {
  @ApiProperty({
    description: 'Fecha inicial para filtrar datos',
    example: '2025-01-01',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty({
    description: 'Fecha final para filtrar datos',
    example: '2025-12-31',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  endDate!: Date;
}
