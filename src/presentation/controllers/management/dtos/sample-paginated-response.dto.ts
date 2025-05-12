import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from '@shared/dtos/paginator.dto';

class SampleItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 1001 })
  code!: number;

  @ApiProperty({ example: 1000.5 })
  weight!: number;

  @ApiProperty({ example: '2023-10-15T14:30:00Z' })
  sampleDate!: Date;

  @ApiProperty({ example: 'Observaciones de la muestra', required: false })
  observation?: string;

  @ApiProperty({ example: 'base64string', required: false })
  base64!: string;

  @ApiProperty({ example: 'jpg' })
  format!: string;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'PROCESADA',
    },
  })
  status!: {
    id: string;
    name: string;
  };
}

export class SampleReceptionItemDto {
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

  @ApiProperty({ example: 'Material en buenas condiciones', required: false })
  observation?: string;

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
      name: 'Muestra',
    },
  })
  receptionType?: {
    id: string;
    name: string;
  };

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Laboratorio',
    },
  })
  receptionOrigin?: {
    id: string;
    name: string;
  };

  @ApiProperty({ type: [SampleItemDto] })
  samples!: SampleItemDto[];
}

export class SamplePaginatedResponseDto {
  @ApiProperty({ type: [SampleReceptionItemDto] })
  items!: SampleReceptionItemDto[];

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
