import { IManagementFilter } from '@domain/interfaces/management';
import {
  ISampleDropdownData,
  ISampleManagementResponse,
} from '@domain/interfaces/management/sample-management.interface';
import { SampleManagementRepository } from '@domain/repositories/management/sample-management.repository';
import { SampleManagementDataSourceService } from '@infrastructure/datasource/management/sample-management.datasource.service';
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
    return await this.sampleManagementDataSource.getDropdownData(
      startDate,
      endDate,
    );
  }

  async findByFilters(
    filter: IManagementFilter,
  ): Promise<IPaginatedData<ISampleManagementResponse>> {
    const { data, total } =
      await this.sampleManagementDataSource.findByFilters(filter);
    const { page, limit } = filter;

    return PaginationHelper.createPaginatedResponseFromItems(data, total, {
      page,
      limit,
    });
  }
}
