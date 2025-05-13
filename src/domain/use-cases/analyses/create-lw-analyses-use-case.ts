import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
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
    return this.analysesRepository.createLWAnalysis(analysis, companyId);
  }
}
