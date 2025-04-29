import { Injectable } from '@nestjs/common';
import { ReceptionOriginRepository } from '@domain/repositories/reception/reception-origin.repository';
import { ReceptionOriginDataSourceService } from '@infrastructure/datasource/reception';
import { ReceptionOrigin } from '@prisma/client';

@Injectable()
export class ReceptionOriginRepositoryImpl extends ReceptionOriginRepository {
  constructor(
    private readonly receptionOriginDataSource: ReceptionOriginDataSourceService,
  ) {
    super();
  }

  async findById(id: string): Promise<ReceptionOrigin> {
    return this.receptionOriginDataSource.findById(id);
  }

  async getDefaultAnalysisByOriginId(
    originId: string,
  ): Promise<Array<{ id: string; name: string; shortName: string }>> {
    return this.receptionOriginDataSource.getDefaultAnalysisByOriginId(
      originId,
    );
  }
}
