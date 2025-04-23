import { ApiProperty } from '@nestjs/swagger';

export class DocumentTypeDto {
  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  id!: string;

  @ApiProperty({ example: 'DNI' })
  name!: string;

  @ApiProperty({ example: 'DNI' })
  code!: string;
}

export class SupplierDto {
  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  id!: string;

  @ApiProperty({ example: 'Proveedor S.A.' })
  name!: string;

  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  documentTypeId!: string;

  @ApiProperty({ example: '20123456789' })
  documentNumber!: string;
}

export class ReceptionTypeDto {
  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  id!: string;

  @ApiProperty({ example: 'Mineral' })
  name!: string;

  @ApiProperty({ example: 'Descripción del tipo de recepción' })
  description?: string;
}

export class ReceptionOriginDto {
  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  id!: string;

  @ApiProperty({ example: 'Cabeza' })
  name!: string;

  @ApiProperty({ example: 'Descripción del origen de recepción' })
  description?: string;
}

export class AnalysisTypeDto {
  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  id!: string;

  @ApiProperty({ example: 'Absorción atómica' })
  name!: string;

  @ApiProperty({ example: 'Descripción del tipo de análisis' })
  description?: string;
}

export class CatalogResponseDto {
  @ApiProperty({ type: [Object] })
  data!:
    | DocumentTypeDto[]
    | SupplierDto[]
    | ReceptionTypeDto[]
    | ReceptionOriginDto[]
    | AnalysisTypeDto[];
}
