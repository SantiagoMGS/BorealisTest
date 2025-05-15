import { IManagementFilter } from '@domain/interfaces/management';
import { SampleManagementRepository } from '@domain/repositories/management/sample-management.repository';
import { MappedSamples } from '@infrastructure/mappers/sample-management.mapper';
import { Injectable } from '@nestjs/common';
import { IPaginatedData } from '@shared/index';

@Injectable()
export class FindSamplesByFiltersUseCase {
  constructor(
    private readonly sampleManagementRepository: SampleManagementRepository,
  ) {}

  async execute(
    filter: IManagementFilter,
  ): Promise<IPaginatedData<MappedSamples>> {
    return await this.sampleManagementRepository.findByFilters(filter);
  }
}
