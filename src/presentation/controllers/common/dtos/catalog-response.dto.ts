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

export class AnalysisTypeDto {
  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  id!: string;

  @ApiProperty({ example: 'Absorción atómica' })
  name!: string;

  @ApiProperty({ example: 'Descripción del tipo de análisis' })
  description?: string;
}

export class DepartmentDto {
  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  id!: string;

  @ApiProperty({ example: 'Lima' })
  name!: string;

  @ApiProperty({ example: 'LIM' })
  code!: string;

  @ApiProperty({
    example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c',
    required: false,
  })
  countryId?: string;
}

export class CityDto {
  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  id!: string;

  @ApiProperty({ example: 'Lima' })
  name!: string;

  @ApiProperty({ example: 'LIM' })
  code!: string;

  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  departmentId!: string;
}

export class DoreReceptionTypeDto {
  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  id!: string;

  @ApiProperty({ example: 'Cabeza' })
  name!: string;

  @ApiProperty({ example: 'Descripción del origen para Doré' })
  description?: string;
}

export class SampleReceptionTypeDto {
  @ApiProperty({ example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c' })
  id!: string;

  @ApiProperty({ example: 'Cabeza' })
  name!: string;

  @ApiProperty({ example: 'Descripción del origen para Muestras' })
  description?: string;
}

export class CatalogResponseDto {
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: '#/components/schemas/DocumentTypeDto' },
        { $ref: '#/components/schemas/SupplierDto' },
        { $ref: '#/components/schemas/ReceptionTypeDto' },
        { $ref: '#/components/schemas/AnalysisTypeDto' },
        { $ref: '#/components/schemas/CityDto' },
        { $ref: '#/components/schemas/DepartmentDto' },
        { $ref: '#/components/schemas/DoreReceptionTypeDto' },
        { $ref: '#/components/schemas/SampleReceptionTypeDto' },
      ],
    },
  })
  data!:
    | DocumentTypeDto[]
    | SupplierDto[]
    | ReceptionTypeDto[]
    | AnalysisTypeDto[]
    | CityDto[]
    | DepartmentDto[]
    | DoreReceptionTypeDto[]
    | SampleReceptionTypeDto[];
}
