import { SampleSelectAllFields } from '@infrastructure/datasource/reception/types/sample-select.type';
export abstract class SampleRepository {
  abstract findById(id: string): Promise<SampleSelectAllFields>;
}
