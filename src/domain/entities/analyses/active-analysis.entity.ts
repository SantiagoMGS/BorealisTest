export type ActiveAnalysis<T> = {
  analysisDate: Date;
  sample: {
    id: string;
    code: string;
  };
  resultValue: T;
};
