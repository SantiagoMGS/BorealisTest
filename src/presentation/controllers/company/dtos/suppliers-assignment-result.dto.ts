import { ApiProperty } from '@nestjs/swagger';

export class SupplierSuccessDto {
  @ApiProperty({
    description: 'ID del proveedor asignado correctamente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  supplierId!: string;

  @ApiProperty({
    description: 'Indica si la asignación fue exitosa',
    example: true,
  })
  success!: boolean;
}

export class SupplierFailureDto {
  @ApiProperty({
    description: 'ID del proveedor que no pudo ser asignado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  supplierId!: string;

  @ApiProperty({
    description: 'Razón por la cual no se pudo asignar el proveedor',
    example: 'El proveedor ya está asignado a la empresa',
  })
  reason!: string;
}

export class SuppliersAssignmentResultDto {
  @ApiProperty({
    description: 'Proveedores asignados correctamente',
    type: [SupplierSuccessDto],
  })
  successful!: SupplierSuccessDto[];

  @ApiProperty({
    description: 'Proveedores que no pudieron ser asignados',
    type: [SupplierFailureDto],
  })
  failed!: SupplierFailureDto[];

  @ApiProperty({
    description: 'Indica si todos los proveedores fallaron al ser asignados',
    example: false,
  })
  allFailed!: boolean;
}
