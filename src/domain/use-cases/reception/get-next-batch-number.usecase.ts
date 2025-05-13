import { Injectable } from '@nestjs/common';
import { SupplierRepository } from '@domain/repositories/supplier';
import { DoreReceptionRepository } from '@domain/repositories/reception/dore-reception.repository';

@Injectable()
export class GetNextBatchNumberUseCase {
  constructor(
    private readonly supplierRepository: SupplierRepository,
    private readonly doreReceptionRepository: DoreReceptionRepository,
  ) {}

  async execute(supplierId: string): Promise<string> {
    const supplier = await this.supplierRepository.findById(supplierId);

    if (!supplier.shortName) {
      throw new Error('Proveedor sin nombre corto definido');
    }

    const currentYear = new Date().getFullYear();
    const batchPrefix = `${supplier.shortName}-D-${currentYear}`;

    const lastBatchNumber =
      await this.doreReceptionRepository.findLastBatchNumberBySupplierId(
        supplierId,
        batchPrefix,
      );

    let consecutive = 1;

    if (lastBatchNumber) {
      const lastConsecutiveMatch = lastBatchNumber.match(/-(\d+)$/);
      if (lastConsecutiveMatch && lastConsecutiveMatch[1]) {
        consecutive = parseInt(lastConsecutiveMatch[1], 10) + 1;
      }
    }

    const batchNumber = `${batchPrefix}-${consecutive}`;

    return batchNumber;
  }
}
