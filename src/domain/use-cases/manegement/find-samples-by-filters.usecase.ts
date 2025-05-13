import { IManagementFilter } from '@domain/interfaces/management';
import { SampleManagementRepository } from '@domain/repositories/management/sample-management.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindSamplesByFiltersUseCase {
  constructor(
    private readonly sampleManagementRepository: SampleManagementRepository,
  ) {}

  async execute(filter: IManagementFilter): Promise<any> {
    return await this.sampleManagementRepository.findByFilters(filter);
  }
}
