import { ApiProperty } from '@nestjs/swagger';
import { ISampleDropdownData } from '@domain/interfaces/management/sample-management.interface';
import { SupplierDropdown } from '@shared/types/supplier-dropdown.type';
import { SampleDropdown } from '@shared/types/sample-dropdown.type';
import { ReceptionOriginDropdown } from '@shared/types/reception-origin-dropdown.type';

export class SampleSupplierDto implements SupplierDropdown {
  @ApiProperty({
    example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c',
    description: 'ID único del proveedor',
  })
  id!: string;

  @ApiProperty({
    example: 'Minera Los Andes',
    description: 'Nombre del proveedor',
  })
  name!: string;
}

export class SampleItemDto implements SampleDropdown {
  @ApiProperty({
    example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c',
    description: 'ID único de la muestra',
  })
  id!: string;

  @ApiProperty({
    example: 'CM-1001',
    description: 'Código de la muestra',
    oneOf: [{ type: 'string' }, { type: 'number' }],
  })
  code!: string | number;
}

export class SampleOriginDto implements ReceptionOriginDropdown {
  @ApiProperty({
    example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c',
    description: 'ID único del origen de recepción',
  })
  id!: string;

  @ApiProperty({
    example: 'CABEZA MOLINO',
    description: 'Nombre del origen de recepción',
  })
  name!: string;
}

export class SampleDropdownDataDto implements ISampleDropdownData {
  @ApiProperty({
    type: [SampleSupplierDto],
    description: 'Lista de proveedores disponibles',
  })
  suppliers!: SampleSupplierDto[];

  @ApiProperty({
    type: [SampleItemDto],
    description: 'Lista de muestras disponibles',
  })
  samples!: SampleItemDto[];

  @ApiProperty({
    type: [SampleOriginDto],
    description: 'Lista de orígenes de recepción disponibles',
  })
  receptionOrigins!: SampleOriginDto[];
}
