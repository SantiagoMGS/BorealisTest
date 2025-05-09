import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class GetDoreDropdownDataDto {
  @ApiProperty({
    description: 'Fecha inicial para filtrar datos',
    example: '2023-01-01',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty({
    description: 'Fecha final para filtrar datos',
    example: '2023-12-31',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  endDate!: Date;
}
