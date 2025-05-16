import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindExistingAnalysisUseCase {
  constructor(private readonly analysesRepository: AnalysesRepository) {}

  async execute(analysisTypeId: string, sampleId: string): Promise<any> {
    return await this.analysesRepository.findExistingAnalysis(
      analysisTypeId,
      sampleId,
    );
  }
}
