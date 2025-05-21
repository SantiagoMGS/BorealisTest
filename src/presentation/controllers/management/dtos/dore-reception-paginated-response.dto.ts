import { ApiProperty } from '@nestjs/swagger';

class DoreItemsDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  code!: number;

  @ApiProperty({})
  receivedWeight!: number;

  @ApiProperty({ required: false })
  base64!: string | null;

  @ApiProperty({})
  format!: string;
}

class SupplierDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  name!: string;
}

class ReceptionOriginDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  name!: string;
}

export class DoreReceptionItemDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  batchNumber!: string | null;

  @ApiProperty({})
  receptionDate!: Date;

  @ApiProperty({})
  observation!: string | null;

  @ApiProperty({ type: [DoreItemsDto] })
  dore!: DoreItemsDto[];

  @ApiProperty({ type: SupplierDto })
  supplier!: SupplierDto;

  @ApiProperty({ type: ReceptionOriginDto })
  receptionOrigin!: ReceptionOriginDto;
}
