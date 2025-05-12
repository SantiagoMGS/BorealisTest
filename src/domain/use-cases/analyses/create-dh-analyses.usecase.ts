import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { Injectable } from '@nestjs/common';
import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';

@Injectable()
export class CreateDHAnalysesUseCase {
  constructor(private readonly analysesRepository: AnalysesRepository) {}

  async execute(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    return this.analysesRepository.createDHAnalyses(analysis, companyId);
  }
}
