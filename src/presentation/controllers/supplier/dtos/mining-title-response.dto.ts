import { ApiProperty } from '@nestjs/swagger';

export class MiningTitleResponseDto {
  @ApiProperty({
    description: 'ID único del título minero',
    example: '029d5411-4b62-48bd-bc0b-0e995c174a95',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del título minero',
    example: 'Título Minero Santa Rosa',
  })
  name!: string;

  @ApiProperty({
    description: 'ID del tipo de mina',
    example: '029d5411-4b62-48bd-bc0b-0e995c174a95',
  })
  mineTypeId!: string;

  @ApiProperty({
    description: 'Nombre del tipo de mina',
    example: 'Subterránea',
  })
  mineTypeName!: string;

  @ApiProperty({
    description: 'Porcentaje de regalías',
    example: '4.5000',
  })
  royaltyPercentage!: string;

  @ApiProperty({
    description: 'ID de la ciudad',
    example: '029d5411-4b62-48bd-bc0b-0e995c174a95',
  })
  cityId!: string;

  @ApiProperty({
    description: 'Nombre de la ciudad',
    example: 'Medellín',
  })
  cityName!: string;

  @ApiProperty({
    description: 'ID del departamento',
    example: '029d5411-4b62-48bd-bc0b-0e995c174a95',
  })
  departmentId!: string;

  @ApiProperty({
    description: 'Nombre del departamento',
    example: 'Antioquia',
  })
  departmentName!: string;
}

export class SupplierMiningTitlesResponseDto {
  @ApiProperty({
    description: 'Títulos mineros del proveedor',
    type: [MiningTitleResponseDto],
  })
  miningTitles!: MiningTitleResponseDto[];
}
