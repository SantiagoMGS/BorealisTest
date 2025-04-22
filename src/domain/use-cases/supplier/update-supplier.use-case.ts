import { Injectable } from '@nestjs/common';
import { ISupplierEntity } from '@domain/entities/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';
import { SupplierRepository } from '@domain/repositories/supplier';

@Injectable()
export class UpdateSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(
    id: string,
    supplierData: Partial<ISupplierEntity>,
    userId?: string,
  ): Promise<ISupplierResponse> {
    // Asignamos el usuario que actualiza si se proporciona
    if (userId) {
      supplierData.updatedBy = userId;
    }

    return this.supplierRepository.update(id, supplierData);
  }
}
