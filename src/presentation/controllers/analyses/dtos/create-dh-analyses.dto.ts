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

class ResultValueDHDto {
  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  dryWeight!: number;
}

export class CreateDHAnalysesDto {
  @ApiProperty({})
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  sampleId!: string;

  @ApiProperty({
    format: 'date-time',
  })
  @IsString()
  @IsNotEmpty()
  analysisDate!: string;

  @ApiProperty({
    type: ResultValueDHDto,
  })
  @ValidateNested()
  @Type(() => ResultValueDHDto)
  @IsNotEmpty()
  resultValue!: ResultValueDH;
}
