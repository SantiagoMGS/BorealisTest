import { AnalysisTypeRepository } from '@domain/repositories/analysis-type/analysis-type.respository';
import { AnalysisTypeDatasourceService } from '@infrastructure/datasource/analysis-type/analysis-type.datasorce.service';
import { AnalysisTypeSelect } from '@infrastructure/datasource/analysis-type/types/analysis-type-select.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalysisTypeRepositoryImpl extends AnalysisTypeRepository {
  constructor(
    private readonly analysisTypeDatasource: AnalysisTypeDatasourceService,
  ) {
    super();
  }

  async findByShortName(shortName: string): Promise<AnalysisTypeSelect> {
    return await this.analysisTypeDatasource.findByShortName(shortName);
  }
}
