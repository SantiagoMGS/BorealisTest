import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from '@shared/dtos/paginator.dto';

export class SampleDetailDto {
  @ApiProperty({ example: '1c9ff601-99b4-4c63-a2cf-4a707ce94db4' })
  id!: string;

  @ApiProperty({ example: 1 })
  code!: number;

  @ApiProperty({ example: '1000.5' })
  receivedWeight!: string;
}

export class SampleSupplierInfoDto {
  @ApiProperty({ example: 'bdff7635-4af2-4e7d-b560-3a76ba809e36' })
  id!: string;

  @ApiProperty({ example: 'Gold Mining International Corp.' })
  name!: string;
}

export class SampleReceptionOriginInfoDto {
  @ApiProperty({ example: '70dcf284-b9ee-4883-87cf-b0b021b596aa' })
  id!: string;

  @ApiProperty({ example: 'CABEZA MOLINO' })
  name!: string;
}

export class SampleReceptionItemDto {
  @ApiProperty({ example: 'b6b55a1c-a76d-4cf6-8877-389f22b88cd5' })
  id!: string;

  @ApiProperty({ example: 'afa03267-1c91-4854-ab8e-3a23d1a486c0' })
  companyId!: string;

  @ApiProperty({ example: 'bdff7635-4af2-4e7d-b560-3a76ba809e36' })
  supplierId!: string;

  @ApiProperty({ example: '2023-10-15T14:30:00.000Z' })
  receptionDate!: string;

  @ApiProperty({ example: 'LOTE-001' })
  batchNumber!: string;

  @ApiProperty({ example: 'Observación general' })
  observation!: string;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: '2025-05-12T16:41:07.920Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-05-12T16:41:07.920Z' })
  updatedAt!: string;

  @ApiProperty({ example: null, required: false })
  createdBy?: string | null;

  @ApiProperty({ example: null, required: false })
  updatedBy?: string | null;

  @ApiProperty({ example: '70dcf284-b9ee-4883-87cf-b0b021b596aa' })
  receptionOriginId!: string;

  @ApiProperty({ example: '2b322b1b-36c0-4f5e-8fd6-8679540dc3dc' })
  receptionTypeId!: string;

  @ApiProperty({ example: null, required: false })
  miningTitleId!: string | null;

  @ApiProperty({ example: null, required: false })
  cityId!: string | null;

  @ApiProperty({ type: [SampleDetailDto] })
  samples!: SampleDetailDto[];

  @ApiProperty({ type: SampleSupplierInfoDto })
  supplier!: SampleSupplierInfoDto;

  @ApiProperty({ type: SampleReceptionOriginInfoDto })
  receptionOrigin!: SampleReceptionOriginInfoDto;
}

export class SamplePaginatedResponseDto {
  @ApiProperty({ type: [SampleReceptionItemDto] })
  items!: SampleReceptionItemDto[];

  @ApiProperty({
    example: {
      total: 4,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  })
  meta!: PaginationMeta;
}
