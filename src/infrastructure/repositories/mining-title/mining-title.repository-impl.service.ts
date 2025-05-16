import { Injectable } from '@nestjs/common';
import { IMiningTitleRepository } from '../../../domain/repositories/mining-title/mining-title.repository';
import { IMiningTitleResponse } from '../../../domain/interfaces/supplier/mining-title-response.interface';
import { MiningTitleDatasource } from '../../datasource/mining-title/mining-title.datasource.service';
import { MiningTitleMapper } from '@infrastructure/mappers/mining-title/mining-title.mapper';

@Injectable()
export class MiningTitleRepositoryImpl implements IMiningTitleRepository {
  constructor(private readonly datasource: MiningTitleDatasource) {}

  async findBySupplierId(supplierId: string): Promise<IMiningTitleResponse[]> {
    const miningTitles = await this.datasource.findBySupplierId(supplierId);
    return MiningTitleMapper.toDomainList(miningTitles);
  }
}
