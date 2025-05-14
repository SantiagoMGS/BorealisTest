import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  IAnalysisEntity,
  ResultValueDH,
} from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import { SampleReceptionDataSourceService } from '@infrastructure/datasource/reception/sample-reception.datasource.service';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { AnalysisTypeDatasourceService } from '@infrastructure/datasource/analysis-type/analysis-type.datasorce.service';

@Injectable()
export class CreateDHAnalysesUseCase {
  constructor(
    private readonly analysesRepository: AnalysesRepository,
    private readonly sampleDataSource: SampleReceptionDataSourceService,
    private readonly companyDataSource: CompanyDataSourceService,
    private readonly analysisTypeDatasource: AnalysisTypeDatasourceService,
  ) {}

  async execute(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      const analysisType =
        await this.analysisTypeDatasource.findByShortName('DH');

      await this.companyDataSource.findById(companyId);

      const sample = await this.sampleDataSource.findById(analysis.sampleId);

      const resultValue = analysis.resultValue as ResultValueDH;

      const receivedWeight = Number(sample.receivedWeight);
      const dryWeight = Number(resultValue.dryWeight);

      const moisture = (1 - dryWeight / receivedWeight) * 100;

      const normalizedResultValue = {
        dryWeight,
        moisture: parseFloat(moisture.toFixed(4)),
      };

      const analysisData = {
        ...analysis,
        resultValue: normalizedResultValue,
        analysisTypeId: analysisType.id,
      };

      return this.analysesRepository.createDHAnalyses(analysisData, companyId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Error al crear el análisis');
    }
  }
}
