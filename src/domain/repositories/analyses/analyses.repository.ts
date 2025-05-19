import { ActiveAnalysis } from '@domain/entities/analyses/active-analysis.entity';
import {
  IAnalysisEntity,
  ResultValueLW,
} from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import {
  IPaginatedData,
  IPaginationOptions,
} from '@shared/interfaces/pagination.interfaces';

export abstract class AnalysesRepository {
  abstract createDHAnalyses(
    analysisData: IAnalysisEntity,
  ): Promise<IAnalysisResponse>;
  abstract createXRFAnalyses(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse>;
  abstract createLWAnalysis(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse>;
  abstract createAAAnalyses(
    analysis: IAnalysisEntity,
    companyId: string,
  ): Promise<IAnalysisResponse>;
  abstract getActiveLWAnalyses(
    options: IPaginationOptions,
  ): Promise<IPaginatedData<ActiveAnalysis<ResultValueLW>>>;
  abstract findExistingAnalysis(
    analysisTypeId: string,
    sampleId: string,
  ): Promise<any>;
}
