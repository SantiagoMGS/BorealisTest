import { Injectable } from '@nestjs/common';
import { SupplierRepository } from '@domain/repositories/supplier';
import { ISupplierEntity } from '@domain/entities/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier';

@Injectable()
export class SupplierRepositoryImpl implements SupplierRepository {
  constructor(private readonly supplierDataSource: SupplierDataSourceService) {}

  async createSupplier(
    supplierData: ISupplierEntity,
  ): Promise<ISupplierResponse> {
    const supplier = await this.supplierDataSource.createSupplier(supplierData);

    return {
      id: supplier.id,
      name: supplier.name,
      documentType: supplier.documentType,
      documentNumber: supplier.documentNumber,
      isActive: supplier.isActive,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    };
  }
}
