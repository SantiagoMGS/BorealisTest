import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import { Injectable } from '@nestjs/common';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { UpdateLWAnalysis } from '@domain/entities/analyses/update-lw-analysis.entity';

@Injectable()
export class UpdateLWAnalysisUseCase {
  constructor(private readonly lwAnalysisRepository: AnalysesRepository) {}

  async execute(
    analysis: UpdateLWAnalysis,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    return this.lwAnalysisRepository.updateLWAnalysis(analysis, companyId);
  }
}
