import { IManagementFilter } from '@domain/interfaces/management';
import { ISampleDropdownData } from '@domain/interfaces/management/sample-management.interface';
import { SampleManagementRepository } from '@domain/repositories/management/sample-management.repository';
import { SampleManagementDataSourceService } from '@infrastructure/datasource/management/sample-management.datasource.service';
import { SampleReceptionDataSourceService } from '@infrastructure/datasource/reception';
import { Injectable } from '@nestjs/common';

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

  async findByFilters(filter: IManagementFilter): Promise<any> {
    return await this.sampleManagementDataSource.findByFilters(filter);
  }
}
