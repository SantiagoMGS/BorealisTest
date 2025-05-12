import { IManagementFilter } from '@domain/interfaces/management';
import { ISampleDropdownData } from '@domain/interfaces/management/sample-management.interface';

export abstract class SampleManagementRepository {
  abstract getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<ISampleDropdownData>;

  abstract findByFilters(filter: IManagementFilter): Promise<any>;
}
