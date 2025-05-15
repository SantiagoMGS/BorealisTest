import { ApiProperty } from '@nestjs/swagger';

export class SupplierDropdownDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  name!: string;
}
