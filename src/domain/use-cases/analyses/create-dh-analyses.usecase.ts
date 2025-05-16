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
import { AnalysisTypeRepository } from '@domain/repositories/analysis-type/analysis-type.respository';

@Injectable()
export class CreateDHAnalysesUseCase {
  constructor(
    private readonly analysesRepository: AnalysesRepository,
    private readonly sampleDataSource: SampleReceptionDataSourceService,
    private readonly analysisTypeRepository: AnalysisTypeRepository,
  ) {}

  async execute(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      const sample = await this.sampleDataSource.findById(analysis.sampleId);

      const analysisType =
        await this.analysisTypeRepository.findByShortName('DH');

      const resultValue = analysis.resultValue as ResultValueDH;

      const receivedWeight = Number(sample.receivedWeight);
      const dryWeight = Number(resultValue.dryWeight);

      if (dryWeight > receivedWeight) {
        throw new BadRequestException(
          'El peso seco no puede ser mayor al peso recibido',
        );
      }

      const moisture = (1 - dryWeight / receivedWeight) * 100;

      const normalizedResultValue = {
        dryWeight,
        moisture: parseFloat(moisture.toFixed(4)),
      };

      const analysisData = {
        ...analysis,
        analysisTypeId: analysisType.id,
        resultValue: normalizedResultValue,
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
