import { Injectable } from '@nestjs/common';
import { ReceptionRepository } from '@domain/repositories/reception/reception.repository';
import { IReceptionResponse } from '@domain/interfaces/reception';
import { IReceptionEntity } from '@domain/entities/reception/reception.entity';
import { ReceptionDataSourceService } from '@infrastructure/datasource/reception/reception.datasource.service';

@Injectable()
export class ReceptionRepositoryImpl implements ReceptionRepository {
  constructor(
    private readonly receptionDataSource: ReceptionDataSourceService,
  ) {}

  async createReception(
    reception: IReceptionEntity,
  ): Promise<IReceptionResponse> {
    return this.receptionDataSource.createReception(reception);
  }

  async getReceptions(
    companyId?: string,
    supplierId?: string,
  ): Promise<{ data: IReceptionResponse[]; total: number }> {
    const receptions = await this.receptionDataSource.getReceptions(
      companyId,
      supplierId,
    );
    return {
      data: receptions,
      total: receptions.length,
    };
  }

  async getReceptionById(id: string): Promise<IReceptionResponse> {
    return this.receptionDataSource.getReceptionById(id);
  }

  async updateReception(
    id: string,
    reception: Partial<IReceptionEntity>,
  ): Promise<IReceptionResponse> {
    return this.receptionDataSource.updateReception(id, reception);
  }

  async deleteReception(id: string): Promise<void> {
    return this.receptionDataSource.deleteReception(id);
  }
}
