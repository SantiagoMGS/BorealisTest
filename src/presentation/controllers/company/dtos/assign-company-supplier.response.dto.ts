import { ApiProperty } from '@nestjs/swagger';

export class CompanySupplierResponseDto {
  @ApiProperty({
    description: 'Mensaje de éxito',
    example: 'Proveedores asignados exitosamente',
  })
  message!: string;

  @ApiProperty({
    description: 'ID de la empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  companyId!: string;

  @ApiProperty({
    description: 'Lista de IDs de proveedores asignados',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '987fcdeb-a123-4567-b89c-012345678901',
    ],
    type: [String],
  })
  supplierIds!: string[];

  @ApiProperty({
    description: 'Fecha de asignación',
    example: '2024-01-20T15:30:00.000Z',
  })
  createdAt!: Date;
}
