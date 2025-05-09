import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import { AnalysesDatasourceService } from '@infrastructure/datasource/analyses/analyses.datasorces.service';
@Injectable()
export class AnalysesRepositoryImpl extends AnalysesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analysesDatasource: AnalysesDatasourceService,
  ) {
    super();
  }

  async createDHAnalyses(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    return await this.analysesDatasource.createDHAnalyses(analysis, companyId);
  }
}
