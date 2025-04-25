import { ApiProperty } from '@nestjs/swagger';

export class ReceptionResponseDto {
  @ApiProperty({
    description: 'ID único de la recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID de la compañía',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  companyId!: string;

  @ApiProperty({
    description: 'ID del proveedor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  supplierId!: string;

  @ApiProperty({
    description: 'ID del tipo de recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  receptionTypeId!: string;

  @ApiProperty({
    description: 'ID del origen de recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  receptionOriginId!: string;

  @ApiProperty({
    description: 'Fecha de recepción',
    example: '2023-10-15T14:30:00Z',
  })
  receptionDate!: Date;

  @ApiProperty({
    description: 'Número de lote',
    example: 'L20231015-001',
    required: false,
  })
  batchNumber?: string;

  @ApiProperty({
    description: 'Observaciones',
    example: 'Material en buenas condiciones',
    required: false,
  })
  observation?: string;

  @ApiProperty({
    description: 'Estado de la recepción',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2023-10-15T14:30:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2023-10-15T14:30:00Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Datos de la compañía',
    required: false,
  })
  company?: any;

  @ApiProperty({
    description: 'Datos del proveedor',
    required: false,
  })
  supplier?: any;

  @ApiProperty({
    description: 'Datos del tipo de recepción',
    required: false,
  })
  receptionType?: any;

  @ApiProperty({
    description: 'Datos del origen de recepción',
    required: false,
  })
  receptionOrigin?: any;

  @ApiProperty({
    description: 'Unidades de recepción y sus muestras',
    required: false,
    type: 'array',
  })
  receptionUnits?: any[];
}
