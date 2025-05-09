import { Injectable } from '@nestjs/common';
import {
  DoreReceptionRepository,
  IDoreDropdownData,
  IDoreReceptionFilter,
} from '@domain/repositories/reception/dore-reception.repository';
import { IDoreReceptionEntity } from '@domain/entities/reception';
import { DoreReceptionDataSourceService } from '@infrastructure/datasource/reception/dore-reception.datasource.service';
import { IPaginatedData } from '@shared/interfaces/pagination.interfaces';
import { IDoreReceptionResponse } from '@domain/interfaces/reception';

@Injectable()
export class DoreReceptionRepositoryImpl extends DoreReceptionRepository {
  constructor(
    private readonly doreReceptionDatasource: DoreReceptionDataSourceService,
  ) {
    super();
  }

  async createDoreReception(doreReception: IDoreReceptionEntity): Promise<any> {
    return await this.doreReceptionDatasource.createReception(doreReception);
  }

  async findByFilters(
    filter: IDoreReceptionFilter,
  ): Promise<IPaginatedData<IDoreReceptionResponse>> {
    return await this.doreReceptionDatasource.findByFilters(filter);
  }

  async findLastBatchNumberBySupplierId(
    supplierId: string,
    prefix: string,
  ): Promise<string | null> {
    return await this.doreReceptionDatasource.findLastBatchNumberBySupplierId(
      supplierId,
      prefix,
    );
  }

  async getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<IDoreDropdownData> {
    return await this.doreReceptionDatasource.getDropdownData(
      startDate,
      endDate,
    );
  }
}
