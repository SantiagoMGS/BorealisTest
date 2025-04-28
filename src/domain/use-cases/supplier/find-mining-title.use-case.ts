import { Injectable } from '@nestjs/common';
import { SupplierRepository } from '@domain/repositories/supplier';
import { IMiningTitleResponse } from '@domain/interfaces/supplier';

@Injectable()
export class FindMiningTitlesUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(supplierId: string): Promise<IMiningTitleResponse[]> {
    if (!supplierId) {
      throw new Error('Debe proporcionar un ID de proveedor');
    }

    return this.supplierRepository.findMiningTitles(supplierId);
  }
}
