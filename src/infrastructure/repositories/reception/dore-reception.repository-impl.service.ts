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
    return await this.doreReceptionDatasource.createDoreReception(
      doreReception,
    );
  }

  async getDoreReceptionById(id: string, companyId: string): Promise<any> {
    return await this.doreReceptionDatasource.getDoreReceptionById(
      id,
      companyId,
    );
  }

  async getDoreReceptions(
    companyId: string,
    supplierId?: string,
  ): Promise<any[]> {
    return await this.doreReceptionDatasource.getDoreReceptions(
      companyId,
      supplierId,
    );
  }
}
