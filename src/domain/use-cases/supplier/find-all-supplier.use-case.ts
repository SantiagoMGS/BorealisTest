import { ISupplierResponse } from '@domain/interfaces/supplier';
import { SupplierRepository } from '@domain/repositories/supplier';
import { Injectable } from '@nestjs/common';
import {
  IPaginatedData,
  IPaginationOptions,
} from '@shared/interfaces/pagination.interfaces';

@Injectable()
export class FindAllSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(): Promise<ISupplierResponse[]> {
    return this.supplierRepository.findAll();
  }

  async executePaginated(
    options: IPaginationOptions,
  ): Promise<IPaginatedData<ISupplierResponse>> {
    return this.supplierRepository.findAllPaginated(options);
  }
}
