import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta, Paginated } from '@shared/dtos/paginator.dto';

class DoreItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 1001 })
  code!: number;

  @ApiProperty({ example: 1000.5 })
  receivedWeight!: number;

  @ApiProperty({ example: 980.2 })
  finalWeight!: number;

  @ApiProperty({ example: 85.5 })
  goldLaw!: number;

  @ApiProperty({ example: 850.5 })
  goldWeight!: number;

  @ApiProperty({ example: 12.3 })
  silverLaw!: number;

  @ApiProperty({ example: 123.0 })
  silverWeight!: number;

  @ApiProperty({ example: 840.2 })
  goldBalance!: number;

  @ApiProperty({ example: 120.1 })
  silverBalance!: number;

  @ApiProperty({ example: true })
  approvedLaw!: boolean;

  @ApiProperty({ example: 'Observaciones del doré', required: false })
  observation?: string;

  @ApiProperty({ example: 'base64string', required: false })
  base64!: string;

  @ApiProperty({ example: 'jpg' })
  format!: string;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'RECIBIDO',
    },
  })
  status!: {
    id: string;
    name: string;
  };
}

export class DoreReceptionItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  companyId!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  supplierId!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  receptionTypeId!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  receptionOriginId!: string;

  @ApiProperty({ example: '2023-10-15T14:30:00Z' })
  receptionDate!: Date;

  @ApiProperty({ example: 'L20231015-001', required: false })
  batchNumber?: string;

  @ApiProperty({ example: 'Material en buenas condiciones', required: false })
  observation?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  cityId?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  miningTitleId?: string;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: '2023-10-15T14:30:00Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2023-10-15T14:30:00Z' })
  updatedAt!: Date;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Empresa ABC',
      shortName: 'ABC',
    },
  })
  company?: {
    id: string;
    name: string;
    shortName: string;
  };

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Proveedor XYZ',
    },
  })
  supplier?: {
    id: string;
    name: string;
  };

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Doré',
    },
  })
  receptionType?: {
    id: string;
    name: string;
  };

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Mina',
    },
  })
  receptionOrigin?: {
    id: string;
    name: string;
  };

  @ApiProperty({ type: [DoreItemDto] })
  dore!: DoreItemDto[];
}

export class DoreReceptionPaginatedResponseDto {
  @ApiProperty({ type: [DoreReceptionItemDto] })
  items!: DoreReceptionItemDto[];

  @ApiProperty({
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
      hasNextPage: true,
      hasPreviousPage: false,
    },
  })
  meta!: PaginationMeta;
}
