import { ResultValueLW } from '@domain/entities/analyses/analyses.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

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
    example: {
      time: 10,
    },
  })
  @ValidateNested()
  @Type(() => ResultValueLWDto)
  @IsNotEmpty()
  resultValue!: ResultValueLW;
}

class ResultValueLWDto {
  @ApiProperty({
    description: 'Tiempo en segundos (número entero positivo)',
    example: 10,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  time!: number;
}
