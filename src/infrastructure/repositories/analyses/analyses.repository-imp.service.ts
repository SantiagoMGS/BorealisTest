import { Injectable } from '@nestjs/common';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import {
  IAnalysisEntity,
  ResultValueLW,
} from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import { AnalysesDatasourceService } from '@infrastructure/datasource/analyses/analyses.datasource.service';
import {
  IPaginatedData,
  IPaginationOptions,
} from '@shared/interfaces/pagination.interfaces';
import { PaginationHelper } from '@shared/utils/pagination.helper';
import { ActiveAnalysis } from '@domain/entities/analyses/active-analysis.entity';

@Injectable()
export class AnalysesRepositoryImpl extends AnalysesRepository {
  constructor(private readonly analysesDatasource: AnalysesDatasourceService) {
    super();
  }

  async createDHAnalyses(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    return await this.analysesDatasource.createDHAnalyses(analysis, companyId);
  }

  async createXRFAnalyses(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    return await this.analysesDatasource.createXRFAnalyses(analysis, companyId);
  }

  async createLWAnalysis(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    return await this.analysesDatasource.createLWAnalysis(analysis, companyId);
  }

  async createAAAnalyses(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    return await this.analysesDatasource.createAAAnalyses(analysis, companyId);
  }

  async getActiveLWAnalyses(
    options: IPaginationOptions,
  ): Promise<IPaginatedData<ActiveAnalysis<ResultValueLW>>> {
    const data = await this.analysesDatasource.getActiveLWAnalyses(options);
    const { page, limit } = options;

    data.sort((a, b) => {
      return (
        new Date(a.resultValue.endDateTime!).getTime() -
        new Date(b.resultValue.endDateTime!).getTime()
      );
    });

    return PaginationHelper.createPaginatedResponseFromItems(
      data,
      data.length,
      {
        page,
        limit,
      },
    );
  }

  async findExistingAnalysis(
    analysisTypeId: string,
    sampleId: string,
  ): Promise<any> {
    return await this.analysesDatasource.findExistingAnalysis(
      analysisTypeId,
      sampleId,
    );
  }
}
