import { ApiProperty } from '@nestjs/swagger';

export class XRFResponse {
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
    example: 'XRF',
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
      reading: '10',
      time: '10',
      type: 'XRF',
      duration: '10',
      voltage: '10',
      current: '10',
      energy: '10',
      intensity: '10',
      background: '10',
    },
  })
  resultValue!: object;
}
