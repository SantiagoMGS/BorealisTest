import { Injectable } from '@nestjs/common';
import {
  DoreReceptionRepository,
  IDoreReceptionFilter,
} from '@domain/repositories/reception/dore-reception.repository';
import { IDoreReceptionEntity } from '@domain/entities/reception';
import { DoreReceptionDataSourceService } from '@infrastructure/datasource/reception/dore-reception.datasource.service';

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

  async findByDateRange(filter: IDoreReceptionFilter): Promise<any> {
    return await this.doreReceptionDatasource.findByDateRange(filter);
  }
}
