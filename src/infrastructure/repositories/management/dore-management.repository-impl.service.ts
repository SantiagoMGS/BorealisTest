import { IManagementFilter } from '@domain/interfaces/management';
import {
  IDoreDropdownData,
  IDoreManagementResponse,
} from '@domain/interfaces/management/dore-management.interface';
import { DoreManagementRepository } from '@domain/repositories/management/dore-management.repository';
import { DoreManagementDataSourceService } from '@infrastructure/datasource/management/dore-management.datasource.service';
import { Injectable } from '@nestjs/common';
import { IPaginatedData } from '@shared/interfaces/pagination.interfaces';
import { PaginationHelper } from '@shared/utils/pagination.helper';

@Injectable()
export class DoreManagementRepositoryImpl extends DoreManagementRepository {
  constructor(
    private readonly doreManagementDataSource: DoreManagementDataSourceService,
  ) {
    super();
  }

  async getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<IDoreDropdownData> {
    return await this.doreManagementDataSource.getDropdownData(
      startDate,
      endDate,
    );
  }

  async findByFilters(
    filter: IManagementFilter,
  ): Promise<IPaginatedData<IDoreManagementResponse>> {
    const { data, total } =
      await this.doreManagementDataSource.findByFilters(filter);
    const { page, limit } = filter;

    return PaginationHelper.createPaginatedResponseFromItems(data, total, {
      page,
      limit,
    });
  }
}
