import { ApiProperty } from '@nestjs/swagger';

export class SupplierDropDownDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  name!: string;
}

export class DoreDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  code!: number;
}

export class ReceptionOriginDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  name!: string;
}

export class DoreDropdownResponseDto {
  @ApiProperty({
    type: [SupplierDropDownDto],
  })
  suppliers!: SupplierDropDownDto[];

  @ApiProperty({
    type: [DoreDto],
  })
  dore!: DoreDto[];

  @ApiProperty({})
  batchNumbers!: string[];

  @ApiProperty({
    type: [ReceptionOriginDto],
  })
  receptionOrigins!: ReceptionOriginDto[];
}
