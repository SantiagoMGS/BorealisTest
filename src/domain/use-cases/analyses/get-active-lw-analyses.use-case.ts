import { Injectable } from '@nestjs/common';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
@Injectable()
export class GetActiveLWAnalysesUseCase {
  constructor(private readonly analysesRepository: AnalysesRepository) {}

  async execute(): Promise<any> {
    return this.analysesRepository.getActiveLWAnalyses();
  }
}
