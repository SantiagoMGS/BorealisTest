import { AnalysisTypeRepository } from '@domain/repositories/analysis-type/analysis-type.respository';
import { AnalysisTypeSelect } from '@infrastructure/datasource/analysis-type/types/analysis-type-select.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAnalysisTypeByNameUseCase {
  constructor(
    private readonly analysisTypeRepository: AnalysisTypeRepository,
  ) {}

  async execute(shortName: string): Promise<AnalysisTypeSelect> {
    return await this.analysisTypeRepository.findByShortName(shortName);
  }
}
