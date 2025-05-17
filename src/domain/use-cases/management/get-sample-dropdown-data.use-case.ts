import { ISampleDropdownData } from '@domain/interfaces/management/sample-dropdown.interface';
import { SampleManagementRepository } from '@domain/repositories/management/sample-management.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetSampleDropdownDataUseCase {
  constructor(
    private readonly sampleManagementRepository: SampleManagementRepository,
  ) {}

  async execute(startDate: Date, endDate: Date): Promise<ISampleDropdownData> {
    return this.sampleManagementRepository.getDropdownData(startDate, endDate);
  }
}
