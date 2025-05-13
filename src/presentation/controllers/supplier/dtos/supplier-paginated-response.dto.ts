import { ApiProperty } from '@nestjs/swagger';
import { SupplierResponseDto } from './supplier-response.dto';

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 10 })
  totalPages!: number;

  @ApiProperty({ example: true })
  hasNextPage!: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage!: boolean;
}

export class SupplierPaginatedResponseDto {
  @ApiProperty({
    description: 'Lista de proveedores',
    type: [SupplierResponseDto],
  })
  items!: SupplierResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    type: PaginationMetaDto,
  })
  meta!: PaginationMetaDto;
}
