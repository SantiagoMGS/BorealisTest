import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  IAnalysisEntity,
  ResultValueDH,
} from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import { FindCompanyByIdUseCase } from '../company/find-company-by-id.use-case';
import { FindAnalysisTypeByNameUseCase } from '../analysis-type/find-analysis-type-by-name.use-case';
import { FindSampleByIdUseCase } from '../sample/find-sample-by-id.use-case';
import { FindExistingAnalysisUseCase } from './find-existing-analysis.use-case';
@Injectable()
export class CreateDHAnalysesUseCase {
  constructor(
    private readonly analysesRepository: AnalysesRepository,
    private readonly findCompanyByIdUseCase: FindCompanyByIdUseCase,
    private readonly findAnalysisTypeByNameUseCase: FindAnalysisTypeByNameUseCase,
    private readonly findSampleByIdUseCase: FindSampleByIdUseCase,
    private readonly findExistingAnalysisUseCase: FindExistingAnalysisUseCase,
  ) {}

  async execute(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    await this.findCompanyByIdUseCase.execute(companyId);

    const sample = await this.findSampleByIdUseCase.execute(analysis.sampleId);

    const analysisType = await this.findAnalysisTypeByNameUseCase.execute('DH');

    const existingAnalysis = await this.findExistingAnalysisUseCase.execute(
      analysisType.id,
      analysis.sampleId,
    );

    if (existingAnalysis) {
      throw new BadRequestException(
        'La muestra ya tiene un análisis de humedad activo',
      );
    }

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

    return this.analysesRepository.createDHAnalyses(analysisData);
  }
}
