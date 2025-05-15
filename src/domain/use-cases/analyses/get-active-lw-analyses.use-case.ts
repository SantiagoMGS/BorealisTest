import { Injectable } from '@nestjs/common';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import {
  IPaginatedData,
  IPaginationOptions,
} from '@shared/interfaces/pagination.interfaces';
import { ResultValueLW } from '@domain/entities/analyses/analyses.entity';
import { ActiveAnalysis } from '@domain/entities/analyses/active-analysis.entity';
export type ActiveLWAnalysis = {
  analysisDate: Date;
  sample: {
    id: string;
    code: string;
  };
  resultValue: ResultValueLW;
};
@Injectable()
export class GetActiveLWAnalysesUseCase {
  constructor(private readonly analysesRepository: AnalysesRepository) {}

  async execute(
    paginationOptions: IPaginationOptions,
  ): Promise<IPaginatedData<ActiveAnalysis<ResultValueLW>>> {
    return this.analysesRepository.getActiveLWAnalyses({
      page: paginationOptions.page || 1,
      limit: paginationOptions.limit || 10,
      withDeleted: paginationOptions.withDeleted || false,
    });
  }
}
