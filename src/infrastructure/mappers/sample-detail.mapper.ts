import { SampleDetailSelect } from '@infrastructure/datasource/management/types/sample-detail-select.type';
import { SampleDetailResponseDto } from '@presentation/controllers/management/dtos/sample-detail-response.dto';

export class SampleDetailMapper {
  static toDto(data: SampleDetailSelect): SampleDetailResponseDto {
    return {
      id: data.id,
      companyId: data.companyId,
      supplierId: data.supplierId,
      receptionDate: data.receptionDate,
      batchNumber: data.batchNumber,
      observation: data.observation,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      receptionOriginId: data.receptionOriginId,
      receptionTypeId: data.receptionTypeId,
      miningTitleId: data.miningTitleId,
      cityId: data.cityId,
      supplier: {
        id: data.supplier.id,
        name: data.supplier.name,
        shortName: data.supplier.shortName,
      },
      samples: data.samples.map((sample) => ({
        id: sample.id,
        receptionId: sample.receptionId,
        receptionOriginId: sample.receptionOriginId,
        receivedWeight: sample.receivedWeight,
        code: sample.code,
        statusId: sample.statusId,
        createdAt: sample.createdAt,
        updatedAt: sample.updatedAt,
        createdBy: sample.createdBy,
        updatedBy: sample.updatedBy,
        receptionOrigin: {
          id: sample.receptionOrigin.id,
          name: sample.receptionOrigin.name,
          shortName: sample.receptionOrigin.shortName,
        },
        status: {
          id: sample.status.id,
          name: sample.status.name,
        },
        requiredAnalyses: sample.requiredAnalyses.map((analysis) => ({
          id: analysis.id,
          sampleId: analysis.sampleId,
          analysisTypeId: analysis.analysisTypeId,
          done: analysis.done,
          analysisType: {
            id: analysis.analysisType.id,
            name: analysis.analysisType.name,
            shortName: analysis.analysisType.shortName,
          },
        })),
        analyses: sample.analyses.map((analysis) => ({
          id: analysis.id,
          analysisTypeId: analysis.analysisTypeId,
          sampleId: analysis.sampleId,
          resultValue: analysis.resultValue,
          analysisDate: analysis.analysisDate,
          isActive: analysis.isActive,
          createdAt: analysis.createdAt,
          updatedAt: analysis.updatedAt,
          analysisType: {
            id: analysis.analysisType.id,
            name: analysis.analysisType.name,
            shortName: analysis.analysisType.shortName,
          },
        })),
        subSamples: sample.subSamples.map((subSample) => ({
          id: subSample.id,
          code: subSample.SampleId, // Usamos SampleId como code ya que es el identificador único
        })),
      })),
    };
  }
}
