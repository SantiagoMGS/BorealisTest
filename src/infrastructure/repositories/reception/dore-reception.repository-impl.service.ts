import { Injectable } from '@nestjs/common';
import { DoreReceptionRepository } from '@domain/repositories/reception/dore-reception.repository';
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
    return this.doreReceptionDatasource.createReception(doreReception);
  }

  async findLastBatchNumberBySupplierId(
    supplierId: string,
    prefix: string,
  ): Promise<string | null> {
    return this.doreReceptionDatasource.findLastBatchNumberBySupplierId(
      supplierId,
      prefix,
    );
  }
}
