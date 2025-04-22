import { Injectable } from '@nestjs/common';
import { ISupplierEntity } from '@domain/entities/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';
import { SupplierRepository } from '@domain/repositories/supplier';

@Injectable()
export class CreateSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(
    supplierData: ISupplierEntity,
    userId?: string,
  ): Promise<ISupplierResponse> {
    // Asignamos el creador si se proporciona el ID del usuario
    if (userId) {
      supplierData.createdBy = userId;
      supplierData.updatedBy = userId;
    }

    return this.supplierRepository.createSupplier(supplierData);
  }
}
