import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@prisma/client';

export class SupplierResponseDto {
  @ApiProperty({
    description: 'ID único del proveedor',
    example: '029d5411-4b62-48bd-bc0b-0e995c174a95',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Minería Santa Rosa',
  })
  name!: string;

  @ApiProperty({
    description: 'Tipo de documento del proveedor',
    enum: DocumentType,
    example: 'NIT',
  })
  documentType!: DocumentType;

  @ApiProperty({
    description: 'Número de documento del proveedor',
    example: '900123456',
  })
  documentNumber!: string;

  @ApiProperty({
    description: 'Estado del proveedor',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2023-09-15T10:30:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2023-09-15T10:30:00.000Z',
  })
  updatedAt!: Date;
}
