import { Injectable } from '@nestjs/common';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import {
  IPaginatedData,
  IPaginationOptions,
} from '@shared/interfaces/pagination.interfaces';

@Injectable()
export class GetActiveLWAnalysesUseCase {
  constructor(private readonly analysesRepository: AnalysesRepository) {}

  async execute(
    paginationOptions: IPaginationOptions,
  ): Promise<IPaginatedData<any>> {
    return this.analysesRepository.getActiveLWAnalyses({
      page: paginationOptions.page || 1,
      limit: paginationOptions.limit || 10,
      withDeleted: paginationOptions.withDeleted || false,
    });
  }
}
