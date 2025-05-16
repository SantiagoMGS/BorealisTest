import { IMiningTitleResponse } from '@domain/interfaces/supplier';
import { IMiningTitleRepository } from '@domain/repositories/mining-title/mining-title.repository';

export class GetMiningTitlesBySupplierUseCase {
  constructor(private readonly miningTitleRepo: IMiningTitleRepository) {}

  async execute(supplierId: string): Promise<IMiningTitleResponse[]> {
    return this.miningTitleRepo.findBySupplierId(supplierId);
  }
}
