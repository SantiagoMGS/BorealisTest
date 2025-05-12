export abstract class SampleManagementRepository {
  abstract getDropdownData(startDate: Date, endDate: Date): Promise<any>;
}
