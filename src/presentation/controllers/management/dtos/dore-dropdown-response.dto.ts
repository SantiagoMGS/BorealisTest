import { ApiProperty } from '@nestjs/swagger';

export class SupplierDropDownDto {
  @ApiProperty({
    description: 'ID del proveedor',
    example: 'cddfc129-2111-4c06-b019-633c828f1fba',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Sofia Rodriguez - Joyería',
  })
  name!: string;
}

export class DoreDto {
  @ApiProperty({
    description: 'ID del doré',
    example: '8ee8dc58-2c10-487b-96dc-21c5ff6310f8',
  })
  id!: string;

  @ApiProperty({
    description: 'Código del doré',
    example: 30000,
  })
  code!: number;
}

export class ReceptionOriginDto {
  @ApiProperty({
    description: 'ID del origen de recepción',
    example: 'f2f825a2-5613-4915-84ea-d56d405d839c',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del origen de recepción',
    example: 'Joyería Desuso',
  })
  name!: string;
}

export class DoreDropdownResponseDto {
  @ApiProperty({
    description: 'Lista de proveedores',
    type: [SupplierDropDownDto],
  })
  suppliers!: SupplierDropDownDto[];

  @ApiProperty({
    description: 'Lista de dorés',
    type: [DoreDto],
  })
  dore!: DoreDto[];

  @ApiProperty({
    description: 'Lista de números de lote',
    example: ['CM-D-2025-001', 'CM-D-2025-002'],
  })
  batchNumbers!: string[];

  @ApiProperty({
    description: 'Lista de orígenes de recepción',
    type: [ReceptionOriginDto],
  })
  receptionOrigins!: ReceptionOriginDto[];
}
