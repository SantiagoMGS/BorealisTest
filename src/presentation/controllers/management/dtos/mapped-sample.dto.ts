// src/presentation/controllers/management/dtos/mapped-sample.dto.ts
import { ApiProperty } from '@nestjs/swagger';

class RequiredAnalysisDto {
  @ApiProperty()
  analysisTypeName!: string;

  @ApiProperty()
  analysisTypeShortName!: string;

  @ApiProperty()
  done!: boolean;
}

class AnalysisDto {
  @ApiProperty()
  analysisTypeName!: string;

  @ApiProperty()
  analysisTypeShortName!: string;

  @ApiProperty()
  analysisDate!: string;

  @ApiProperty()
  resultValue!: any;
}

export class MappedSampleDto {
  @ApiProperty()
  supplierName!: string;

  @ApiProperty()
  supplierShortName!: string;

  @ApiProperty()
  sampleCode!: number | string;

  @ApiProperty()
  receivedWeight!: string;

  @ApiProperty()
  receptionOriginName!: string;

  @ApiProperty()
  receptionOriginShortName!: string;

  @ApiProperty({ type: [RequiredAnalysisDto] })
  requiredAnalyses!: RequiredAnalysisDto[];

  @ApiProperty({ type: [AnalysisDto] })
  analyses!: AnalysisDto[];
}
