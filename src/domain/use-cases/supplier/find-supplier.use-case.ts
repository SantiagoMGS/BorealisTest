import { Injectable } from '@nestjs/common';
import { SupplierRepository } from '@domain/repositories/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';

@Injectable()
export class FindSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(params: {
    id?: string;
    documentNumber?: string;
  }): Promise<ISupplierResponse> {
    if (!params.id && !params.documentNumber) {
      throw new Error('Debe proporcionar un id o número de documento');
    }

    return this.supplierRepository.findByParams({
      id: params.id,
      documentNumber: params.documentNumber,
    });
  }
}
