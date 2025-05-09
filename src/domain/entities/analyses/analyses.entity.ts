export interface IAnalysisEntity {
  sampleId: string;
  analysisTypeId: string;
  analysisDate: Date;
  resultValue: ResultValue;
}

export interface ResultValue {
  [key: string]: string;
}
