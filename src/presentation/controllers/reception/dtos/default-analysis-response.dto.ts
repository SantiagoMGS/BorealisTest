import { ApiProperty } from '@nestjs/swagger';

export class DefaultAnalysisResponseDto {
  @ApiProperty({
    description: 'ID único del tipo de análisis',
    example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre completo del tipo de análisis',
    example: 'Fluorescencia de Rayos X',
  })
  name!: string;

  @ApiProperty({
    description: 'Nombre corto del tipo de análisis',
    example: 'XRF',
  })
  shortName!: string;

  @ApiProperty({
    description:
      'Indica si el análisis está seleccionado por defecto para este origen',
    example: true,
    default: true,
  })
  selected!: boolean;
}
