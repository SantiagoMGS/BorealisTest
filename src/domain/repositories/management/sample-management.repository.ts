import { IManagementFilter } from '@domain/interfaces/management';
import { ISampleDropdownData } from '@domain/interfaces/management/sample-dropdown.interface';
import { SampleDetailSelect } from '@infrastructure/datasource/management/types/sample-detail-select.type';
import { MappedSamples } from '@infrastructure/mappers/sample-management.mapper';
import { IPaginatedData } from '@shared/index';

export abstract class SampleManagementRepository {
  abstract getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<ISampleDropdownData>;

  abstract findByFilters(
    filter: IManagementFilter,
  ): Promise<IPaginatedData<MappedSamples>>;

  abstract getDetailSample(id: string): Promise<SampleDetailSelect>;
}
