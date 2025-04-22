import { ISupplierResponse } from '@domain/interfaces/supplier';
import { SupplierRepository } from '@domain/repositories/supplier';
import { Injectable } from '@nestjs/common';
import { Supplier } from '@prisma/client';

@Injectable()
export class FindAllSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(): Promise<ISupplierResponse[]> {
    return this.supplierRepository.findAll();
  }
}
