import { ApiProperty } from '@nestjs/swagger';

export class ReceptionOriginDropdownDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  name!: string;
}
