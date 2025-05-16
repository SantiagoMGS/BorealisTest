import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

class DoreStatusDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  name!: string;
}

class DoreItemsDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  code!: number;

  @ApiProperty({})
  receivedWeight!: number;

  @ApiProperty({})
  base64!: string;

  @ApiProperty({})
  format!: string;

  @ApiProperty({ type: DoreStatusDto })
  status!: DoreStatusDto;
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
  observation?: string | null;

  @ApiProperty({ type: [DoreItemsDto] })
  dore!: DoreItemsDto[];

  @ApiProperty({ type: SupplierDto })
  supplier!: SupplierDto;

  @ApiProperty({ type: ReceptionOriginDto })
  receptionOrigin!: ReceptionOriginDto;
}
