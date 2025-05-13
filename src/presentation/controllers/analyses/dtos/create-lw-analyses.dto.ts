import { ResultValueLW } from '@domain/entities/analyses/analyses.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class CreateLWAnalysesDto {
  @ApiProperty({
    description: 'ID de la muestra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  sampleId!: string;

  @ApiProperty({
    description: 'Fecha del análisis',
    example: '2021-01-01',
  })
  @IsString()
  @IsNotEmpty()
  analysisDate!: string;

  @ApiProperty({
    description: 'Resultado del análisis',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsObject()
  @IsNotEmpty()
  resultValue!: ResultValueLW;
}
