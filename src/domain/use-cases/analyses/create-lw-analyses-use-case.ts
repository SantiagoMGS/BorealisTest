import {
  ResultValueLW,
  IAnalysisEntity,
} from '@domain/entities/analyses/analyses.entity';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { Injectable } from '@nestjs/common';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';

@Injectable()
export class createLWAnalysisUseCase {
  constructor(private readonly analysesRepository: AnalysesRepository) {}

  async execute(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    const resultValue = analysis.resultValue as ResultValueLW;

    const endDateTime = new Date(analysis.analysisDate);
    endDateTime.setMinutes(endDateTime.getMinutes() + resultValue.time);

    const processedAnalysis: IAnalysisEntity = {
      ...analysis,
      resultValue: {
        ...resultValue,
        endDateTime: endDateTime,
        done: false,
      },
    };

    return this.analysesRepository.createLWAnalysis(
      processedAnalysis,
      companyId,
    );
  }
}
