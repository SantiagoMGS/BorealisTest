import { ApiProperty } from '@nestjs/swagger';

export class LWResponse {
  @ApiProperty({
    description: 'ID del análisis',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'ID de la muestra',
    example: '12345678-1234-1234-1234-123456789012',
  })
  sampleId!: string;

  @ApiProperty({
    description: 'ID del tipo de análisis',
    example: 'LW',
  })
  analysisTypeId!: string;

  @ApiProperty({
    description: 'Fecha del análisis',
    example: '2023-01-01T00:00:00.000Z',
  })
  analysisDate!: string;

  @ApiProperty({
    description: 'Valor del análisis',
    example: {
      time: 10,
    },
  })
  resultValue!: object;
}
