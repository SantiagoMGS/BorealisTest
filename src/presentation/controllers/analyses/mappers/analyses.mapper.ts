import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
import { CreateAnalysesDto } from '../dtos/create-analyses.dto';

export class AnalysesMapper {
  static toEntity(analysis: CreateAnalysesDto): IAnalysisEntity {
    return {
      sampleId: analysis.sampleId,
      analysisDate: new Date(analysis.analysisDate),
      resultValue: analysis.resultValue,
    };
  }
}
