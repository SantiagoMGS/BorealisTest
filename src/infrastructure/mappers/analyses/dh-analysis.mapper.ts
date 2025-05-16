import { ResultValueDH } from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import { Prisma } from '@prisma/client';

export class DHAnalysisMapper {
  static toDomain(
    prismaAnalysis: Prisma.AnalysisGetPayload<{}>,
  ): IAnalysisResponse {
    return {
      id: prismaAnalysis.id,
      sampleId: prismaAnalysis.sampleId,
      analysisTypeId: prismaAnalysis.analysisTypeId,
      analysisDate: prismaAnalysis.analysisDate,
      resultValue: prismaAnalysis.resultValue as ResultValueDH,
    };
  }
}
