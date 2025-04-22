import { Injectable } from '@nestjs/common';
import { ISupplierResponse } from '@domain/interfaces/supplier';
import { SupplierRepository } from '@domain/repositories/supplier';

@Injectable()
export class DeleteSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(id: string, userId?: string): Promise<ISupplierResponse> {
    return this.supplierRepository.delete(id, userId);
  }
}
