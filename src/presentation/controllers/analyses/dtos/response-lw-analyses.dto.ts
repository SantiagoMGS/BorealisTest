import { ApiProperty } from '@nestjs/swagger';
import { ResultValueLW } from '@domain/entities/analyses/analyses.entity';
export class LWResponse {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  sampleId!: string;

  @ApiProperty({})
  analysisTypeId!: string;

  @ApiProperty({})
  analysisDate!: string;

  @ApiProperty({
    description: 'Resultado del análisis',
    example: {
      endDateTime: '2023-01-01T00:00:00.000Z',
      realEndDateTime: '2023-01-01T00:00:00.000Z',
      time: 10,
      done: true,
    },
  })
  resultValue!: ResultValueLW;
}
