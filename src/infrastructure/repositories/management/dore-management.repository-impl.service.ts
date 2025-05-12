import { IDoreDropdownData } from '@domain/interfaces/management/dore-management.interface';
import { DoreManagementRepository } from '@domain/repositories/management/dore-management.repository';
import { DoreManagementDataSourceService } from '@infrastructure/datasource/management/dore-management.datasource.service';
import { DoreReceptionDataSourceService } from '@infrastructure/datasource/reception/dore-reception.datasource.service';
import { Injectable } from '@nestjs/common';

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
}
