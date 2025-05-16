import {
  IDoreDropdownData,
  IDoreManagementResponse,
} from '@domain/interfaces/management/dore-management.interface';
import { IPaginatedData } from '@shared/index';
import { IManagementFilter } from '@domain/interfaces/management';

export abstract class DoreManagementRepository {
  abstract getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<IDoreDropdownData>;

  abstract findByFilters(
    filter: IManagementFilter,
  ): Promise<IPaginatedData<IDoreManagementResponse>>;
}
