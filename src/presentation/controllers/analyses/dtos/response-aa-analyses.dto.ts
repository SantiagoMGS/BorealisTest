import { ResultValueAA } from '@domain/entities/analyses/analyses.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseAAAnalysesDto {
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
    description: 'Fecha del análisis',
    example: '2023-01-01T00:00:00.000Z',
  })
  analysisDate!: string;

  @ApiProperty({
    description: 'Resultado del análisis',
    example: {
      status: 'success',
    },
  })
  resultValue!: ResultValueAA;
}
