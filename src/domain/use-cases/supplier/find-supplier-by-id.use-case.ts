import { Injectable } from '@nestjs/common';
import { SupplierRepository } from '@domain/repositories/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';

@Injectable()
export class FindSupplierByIdUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

    async execute(id: string): Promise<ISupplierResponse> {

    return this.supplierRepository.findById(id);
  }
}
