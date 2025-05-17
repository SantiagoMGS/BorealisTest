import { IManagementFilter } from '@domain/interfaces/management';
import { ISampleDropdownData } from '@domain/interfaces/management/sample-dropdown.interface';
import { SampleManagementRepository } from '@domain/repositories/management/sample-management.repository';
import { SampleManagementDataSourceService } from '@infrastructure/datasource/management/sample-management.datasource.service';
import {
  MappedSamples,
  SampleManagementMapper,
} from '@infrastructure/mappers/sample-management.mapper';
import { Injectable } from '@nestjs/common';
import { IPaginatedData } from '@shared/interfaces/pagination.interfaces';
import { PaginationHelper } from '@shared/utils/pagination.helper';

@Injectable()
export class SampleManagementRepositoryImpl extends SampleManagementRepository {
  constructor(
    private readonly sampleManagementDataSource: SampleManagementDataSourceService,
  ) {
    super();
  }

  async getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<ISampleDropdownData> {
    return this.sampleManagementDataSource.getDropdownData(startDate, endDate);
  }

  async findByFilters(
    filter: IManagementFilter,
  ): Promise<IPaginatedData<MappedSamples>> {
    const data = await this.sampleManagementDataSource.findByFilters(filter);
    const { page, limit } = filter;
    const resultado = SampleManagementMapper.toDomain(data);
    return PaginationHelper.createPaginatedResponseFromItems(
      resultado,
      resultado.length,
      {
        page,
        limit,
      },
    );
  }
}
