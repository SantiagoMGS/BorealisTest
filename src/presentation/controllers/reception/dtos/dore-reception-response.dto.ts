import { ApiProperty } from '@nestjs/swagger';

class DoreItemResponseDto {
  @ApiProperty({
    description: 'Peso recibido',
    example: 1000.5,
  })
  receivedWeight!: number;

  @ApiProperty({
    description: 'Observaciones del doré',
    example: 'Doré en buenas condiciones',
    required: false,
  })
  observation?: string;
}

export class DoreReceptionResponseDto {
  @ApiProperty({
    description: 'ID de la recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

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
    description: 'Indica si está activo',
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
    description: 'Compañía asociada',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Compañía ABC',
      shortName: 'ABC',
    },
  })
  company?: {
    id: string;
    name: string;
    shortName: string;
  };

  @ApiProperty({
    description: 'Proveedor asociado',
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
    description: 'Tipo de recepción',
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
    description: 'Origen de recepción',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Planta XYZ',
    },
  })
  receptionOrigin?: {
    id: string;
    name: string;
  };

  @ApiProperty({
    description: 'Items de doré',
    type: [DoreItemResponseDto],
  })
  dores?: DoreItemResponseDto[];
}
