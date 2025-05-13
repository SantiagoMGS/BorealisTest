import { IManagementFilter } from '@domain/interfaces/management';
import {
  ISampleDropdownData,
  ISampleManagementResponse,
} from '@domain/interfaces/management/sample-management.interface';
import { IPaginatedData } from '@shared/index';

export abstract class SampleManagementRepository {
  abstract getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<ISampleDropdownData>;

  abstract findByFilters(
    filter: IManagementFilter,
  ): Promise<IPaginatedData<ISampleManagementResponse>>;
}
