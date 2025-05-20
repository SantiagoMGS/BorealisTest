import { ResultValueAA } from '@domain/entities/analyses/analyses.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseAAAnalysesDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  sampleId!: string;

  @ApiProperty({})
  analysisDate!: string;

  @ApiProperty({
    description: 'Resultado del análisis',
    example: {
      status: 'success',
      dataset: 'dataset',
      method: 'method',
      au: 'au',
    },
  })
  resultValue!: ResultValueAA;
}
