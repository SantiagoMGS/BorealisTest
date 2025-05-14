import { ResultValueDH } from '@domain/entities/analyses/analyses.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class CreateDHAnalysesDto {
  @ApiProperty({
    description: 'ID de la muestra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  sampleId!: string;

  @ApiProperty({
    description: 'ID de la submuestra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  subsampleId!: string;

  @ApiProperty({
    description: 'Fecha del análisis',
    example: '2023-09-15T14:30:00Z',
  })
  @IsString()
  @IsNotEmpty()
  analysisDate!: string;

  @ApiProperty({
    description: 'Resultado del análisis',
    example: {
      dryWeight: 83,
    },
    type: Object,
  })
  @IsObject()
  @IsNotEmpty()
  resultValue!: ResultValueDH;
}
