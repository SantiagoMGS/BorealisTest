import { Injectable } from '@nestjs/common';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import { AnalysesDatasourceService } from '@infrastructure/datasource/analyses/analyses.datasource.service';
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

  async getActiveLWAnalyses(): Promise<any> {
    return await this.analysesDatasource.getActiveLWAnalyses();
  }
}
