import { IDropdownData } from '@domain/interfaces/management/sample-management.interface';

export abstract class SampleManagementRepository {
  abstract getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<IDropdownData>;
}
