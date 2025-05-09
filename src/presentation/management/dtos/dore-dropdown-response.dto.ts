import { ApiProperty } from '@nestjs/swagger';

export class SupplierDto {
  @ApiProperty({
    description: 'ID del proveedor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Proveedor XYZ',
  })
  name!: string;
}

export class DoreDto {
  @ApiProperty({
    description: 'ID del doré',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Código del doré',
    example: 12345,
  })
  code!: number;
}

export class ReceptionOriginDto {
  @ApiProperty({
    description: 'ID del origen de recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del origen de recepción',
    example: 'Planta XYZ',
  })
  name!: string;
}

export class DoreDropdownResponseDto {
  @ApiProperty({
    description: 'Lista de proveedores',
    type: [SupplierDto],
  })
  suppliers!: SupplierDto[];

  @ApiProperty({
    description: 'Lista de dorés',
    type: [DoreDto],
  })
  dore!: DoreDto[];

  @ApiProperty({
    description: 'Lista de números de lote',
    example: ['ABC-D-2023-001', 'ABC-D-2023-002'],
  })
  batchNumbers!: string[];

  @ApiProperty({
    description: 'Lista de orígenes de recepción',
    type: [ReceptionOriginDto],
  })
  receptionOrigins!: ReceptionOriginDto[];
}
