import { AnalysisTypeSelect } from '@infrastructure/datasource/analysis-type/types/analysis-type-select.type';

export abstract class AnalysisTypeRepository {
  abstract findByShortName(shortName: string): Promise<AnalysisTypeSelect>;
}
