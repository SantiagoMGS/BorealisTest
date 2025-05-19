import { SamplesWithAnalyses } from '@infrastructure/datasource/management/types/sample-management-reception-select.type';

export interface MappedSamples {
  supplierName: string;
  supplierShortName: string;
  sampleId: string;
  sampleCode: number;
  receivedWeight: string;
  receptionOriginName: string;
  receptionOriginShortName: string;
  requiredAnalyses: {
    analysisTypeName: string;
    analysisTypeShortName: string;
    done: boolean;
  }[];
  analyses: {
    analysisTypeName: string;
    analysisTypeShortName: string;
    analysisDate: string;
    resultValue: any;
  }[];
}

export class SampleManagementMapper {
  static toDomain(data: SamplesWithAnalyses[]): MappedSamples[] {
    if (!Array.isArray(data)) return [];

    return data.flatMap((reception) =>
      (reception.samples || []).map((sample: any) => ({
        supplierName: reception.supplier?.name ?? '',
        supplierShortName: reception.supplier?.shortName ?? '',
        sampleId: sample.id,
        sampleCode: sample.code,
        receivedWeight: sample.receivedWeight,
        receptionOriginName: sample.receptionOrigin?.name ?? '',
        receptionOriginShortName: sample.receptionOrigin?.shortName ?? '',
        requiredAnalyses: (sample.requiredAnalyses || []).map((ra: any) => ({
          analysisTypeName: ra.analysisType?.name ?? '',
          analysisTypeShortName: ra.analysisType?.shortName ?? '',
          done: ra.done,
        })),
        analyses: (sample.analyses || []).map((a: any) => ({
          analysisTypeName: a.analysisType?.name ?? '',
          analysisTypeShortName: a.analysisType?.shortName ?? '',
          analysisDate: a.analysisDate,
          resultValue: a.resultValue,
        })),
      })),
    );
  }
}
