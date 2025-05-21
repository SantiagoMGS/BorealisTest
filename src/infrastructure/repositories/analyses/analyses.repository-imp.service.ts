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
import {
  AAAnalysisMapper,
  DHAnalysisMapper,
  LWAnalysisMapper,
  XRFAnalysisMapper,
} from '@infrastructure/mappers/analyses/analysis.mapper';
import { UpdateLWAnalysis } from '@domain/entities/analyses/update-lw-analysis.entity';
@Injectable()
export class AnalysesRepositoryImpl extends AnalysesRepository {
  constructor(private readonly analysesDatasource: AnalysesDatasourceService) {
    super();
  }

  async createDHAnalyses(
    analysisData: IAnalysisEntity,
  ): Promise<IAnalysisResponse> {
    const createdAnalysis =
      await this.analysesDatasource.createDHAnalyses(analysisData);
    return DHAnalysisMapper.toDomain(createdAnalysis);
  }

  async createXRFAnalyses(
    analysis: IAnalysisEntity,
  ): Promise<IAnalysisResponse> {
    const createdAnalysis =
      await this.analysesDatasource.createXRFAnalyses(analysis);
    return XRFAnalysisMapper.toDomain(createdAnalysis);
  }

  async createLWAnalysis(
    analysis: IAnalysisEntity,
  ): Promise<IAnalysisResponse> {
    const createdAnalysis =
      await this.analysesDatasource.createLWAnalysis(analysis);
    return LWAnalysisMapper.toDomain(createdAnalysis);
  }

  async createAAAnalyses(
    analysis: IAnalysisEntity,
  ): Promise<IAnalysisResponse> {
    const createdAnalysis =
      await this.analysesDatasource.createAAAnalyses(analysis);
    return AAAnalysisMapper.toDomain(createdAnalysis);
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
    return this.analysesDatasource.findExistingAnalysis(
      analysisTypeId,
      sampleId,
    );
  }

  async updateLWAnalysis(
    analysis: UpdateLWAnalysis,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    return this.analysesDatasource.updateLWAnalysis(analysis, companyId);
  }
}
