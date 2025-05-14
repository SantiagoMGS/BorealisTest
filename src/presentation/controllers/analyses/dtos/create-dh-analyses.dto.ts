import { ResultValueDH } from '@domain/entities/analyses/analyses.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class ResultValueDHDto implements ResultValueDH {
  @ApiProperty({
    description: 'Peso seco en gramos',
    example: 950,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  dryWeight!: number;
}

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
    description: 'Fecha del análisis',
    example: '2023-09-15T14:30:00Z',
  })
  @IsString()
  @IsNotEmpty()
  analysisDate!: string;

  @ApiProperty({
    description: 'Resultado del análisis',
    example: {
      dryWeight: 950,
    },
    type: ResultValueDHDto,
  })
  @ValidateNested()
  @Type(() => ResultValueDHDto)
  @IsNotEmpty()
  resultValue!: ResultValueDH;
}
