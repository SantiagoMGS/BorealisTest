import { Injectable } from '@nestjs/common';
import { ReceptionOriginRepository } from '@domain/repositories/reception/reception-origin.repository';
import { ReceptionOriginDataSourceService } from '@infrastructure/datasource/reception/reception-origin.datasource.service';

@Injectable()
export class ReceptionOriginRepositoryImpl
  implements ReceptionOriginRepository
{
  constructor(
    private readonly receptionOriginDataSource: ReceptionOriginDataSourceService,
  ) {}

  async getReceptionOriginById(id: string) {
    return this.receptionOriginDataSource.getReceptionOriginById(id);
  }

  async getDefaultAnalysisByOriginId(originId: string) {
    return this.receptionOriginDataSource.getDefaultAnalysisByOriginId(
      originId,
    );
  }
}
