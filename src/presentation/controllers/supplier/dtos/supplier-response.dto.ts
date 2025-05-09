import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DocumentTypeDto {
  @ApiProperty({
    description: 'ID único del tipo de documento',
    example: '029d5411-4b62-48bd-bc0b-0e995c174a95',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del tipo de documento',
    example: 'Número de Identificación Tributaria',
  })
  name!: string;

  @ApiProperty({
    description: 'Código del tipo de documento',
    example: 'NIT',
  })
  code!: string;
}

export class SupplierResponseDto {
  @ApiProperty({
    description: 'ID único del proveedor',
    example: '029d5411-4b62-48bd-bc0b-0e995c174a95',
  })
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Minería Santa Rosa',
  })
  name!: string;

  @ApiProperty({
    description: 'Tipo de documento del proveedor',
    type: DocumentTypeDto,
  })
  documentType!: DocumentTypeDto;

  @ApiProperty({
    description: 'Número de documento del proveedor',
    example: '900123456',
  })
  documentNumber!: string;

  @ApiProperty({
    description: 'Dígito de verificación del documento',
    example: 1,
    required: false,
    nullable: true,
  })
  verificationDigit?: number | null;

  @ApiProperty({
    description: 'Nombre corto del proveedor',
    example: 'MSR',
  })
  shortName!: string;

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
