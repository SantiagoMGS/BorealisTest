import { ResultValueDH } from '@domain/entities/analyses/analyses.entity';

export interface IAnalysisResponse {
  id: string;
  sampleId: string;
  analysisTypeId: string;
  analysisDate: Date;
  resultValue: ResultValueDH;
}
