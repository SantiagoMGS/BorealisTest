export interface IAnalysisEntity {
  sampleId: string;
  analysisDate: Date;
  resultValue: ResultValueDH;
}

export interface ResultValueDH {
  dryWeight: number;
}
