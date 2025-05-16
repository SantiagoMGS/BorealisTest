import { ApiProperty } from '@nestjs/swagger';

export class SampleDropdownDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  code!: string | number;
}
