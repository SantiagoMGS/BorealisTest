import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from '@shared/dtos/paginator.dto';

export class SampleItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  receptionId!: string;

  @ApiProperty({ example: 1001 })
  code!: number;

  @ApiProperty({ example: 1000.5 })
  receivedWeight!: string;

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

  @ApiProperty({ example: '2023-10-15T14:30:00Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2023-10-15T14:30:00Z' })
  updatedAt!: Date;

  @ApiProperty({ example: 'usuario1', required: false })
  createdBy?: string | null;

  @ApiProperty({ example: 'usuario1', required: false })
  updatedBy?: string | null;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'LABORATORIO',
    },
  })
  receptionOrigin!: {
    id: string;
    name: string;
  };

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      batchNumber: 'LOTE-001',
      receptionDate: '2023-10-15T14:30:00Z',
      supplier: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Gold Mining International Corp.',
      },
    },
  })
  reception!: {
    id: string;
    batchNumber: string;
    receptionDate: Date;
    supplier: {
      id: string;
      name: string;
    };
  };
}

export class SamplePaginatedResponseDto {
  @ApiProperty({ type: [SampleItemDto] })
  items!: SampleItemDto[];

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
