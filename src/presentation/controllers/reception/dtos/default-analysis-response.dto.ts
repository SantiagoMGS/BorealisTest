import { ApiProperty } from '@nestjs/swagger';

export class DefaultAnalysisResponseDto {
  @ApiProperty({
    description: 'ID del tipo de análisis',
    example: 'cfe72ce1-7144-4d85-9765-1c4c3fd5db4c',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del tipo de análisis',
    example: 'XRF',
  })
  name!: string;
}
