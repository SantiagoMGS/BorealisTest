import {
  ResultValueLW,
  IAnalysisEntity,
} from '@domain/entities/analyses/analyses.entity';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import { FindAnalysisTypeByNameUseCase } from '../analysis-type/find-analysis-type-by-name.use-case';
import { FindExistingAnalysisUseCase } from './find-existing-analysis.use-case';
import { FindCompanyByIdUseCase } from '../company/find-company-by-id.use-case';
import { FindSampleByIdUseCase } from '../sample/find-sample-by-id.use-case';
@Injectable()
export class createLWAnalysisUseCase {
  constructor(
    private readonly analysesRepository: AnalysesRepository,
    private readonly findAnalysisTypeByNameUseCase: FindAnalysisTypeByNameUseCase,
    private readonly findExistingAnalysisUseCase: FindExistingAnalysisUseCase,
    private readonly findCompanyByIdUseCase: FindCompanyByIdUseCase,
    private readonly findSampleByIdUseCase: FindSampleByIdUseCase,
  ) {}

  async execute(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    await this.findCompanyByIdUseCase.execute(companyId);

    await this.findSampleByIdUseCase.execute(analysis.sampleId);

    const analysisType = await this.findAnalysisTypeByNameUseCase.execute('LW');

    const existingAnalysis = await this.findExistingAnalysisUseCase.execute(
      analysisType.id,
      analysis.sampleId,
    );

    if (existingAnalysis) {
      throw new BadRequestException(
        'La muestra ya tiene un análisis Leachwell activo',
      );
    }

    const resultValue = analysis.resultValue as ResultValueLW;

    const endDateTime = new Date(analysis.analysisDate);
    endDateTime.setMinutes(endDateTime.getMinutes() + resultValue.time);

    const processedAnalysis: IAnalysisEntity = {
      ...analysis,
      analysisTypeId: analysisType.id,
      resultValue: {
        ...resultValue,
        endDateTime: endDateTime,
        done: false,
      },
    };
    return this.analysesRepository.createLWAnalysis(processedAnalysis);
  }
}
