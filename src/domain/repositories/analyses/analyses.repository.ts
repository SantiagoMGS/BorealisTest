import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import {
  IPaginatedData,
  IPaginationOptions,
} from '@shared/interfaces/pagination.interfaces';

export abstract class AnalysesRepository {
  abstract createDHAnalyses(
    analysis: IAnalysisEntity,
    companyId: string,
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
  ): Promise<IPaginatedData<any>>;
}
