import { IMiningTitleResponse } from '../../interfaces/supplier/mining-title-response.interface';

export interface IMiningTitleRepository {
  findBySupplierId(supplierId: string): Promise<IMiningTitleResponse[]>;
}
