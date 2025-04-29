import { Injectable } from '@nestjs/common';
import { SampleReceptionRepository } from '@domain/repositories/reception/sample-reception.repository';
import { IReceptionResponse } from '@domain/interfaces/reception';
import { IReceptionEntity } from '@domain/entities/reception/reception.entity';
import { SampleReceptionDataSourceService } from '@infrastructure/datasource/reception/sample-reception.datasource.service';

@Injectable()
export class SampleReceptionRepositoryImpl
  implements SampleReceptionRepository
{
  constructor(
    private readonly sampleReceptionDataSource: SampleReceptionDataSourceService,
  ) {}

  async createReception(
    reception: IReceptionEntity,
  ): Promise<IReceptionResponse> {
    return this.sampleReceptionDataSource.createReception(reception);
  }

  async getReceptions(
    companyId?: string,
    supplierId?: string,
  ): Promise<{ data: IReceptionResponse[]; total: number }> {
    const receptions = await this.sampleReceptionDataSource.getReceptions(
      companyId,
      supplierId,
    );
    return {
      data: receptions,
      total: receptions.length,
    };
  }

  async getReceptionById(
    id: string,
    companyId: string,
  ): Promise<IReceptionResponse> {
    return this.sampleReceptionDataSource.getReceptionById(id, companyId);
  }

  async updateReception(
    id: string,
    reception: Partial<IReceptionEntity>,
  ): Promise<IReceptionResponse> {
    return this.sampleReceptionDataSource.updateReception(id, reception);
  }

  async deleteReception(id: string): Promise<void> {
    return this.sampleReceptionDataSource.deleteReception(id);
  }
}
