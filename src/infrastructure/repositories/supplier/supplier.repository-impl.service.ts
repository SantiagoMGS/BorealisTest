import { Injectable } from '@nestjs/common';
import { SupplierRepository } from '@domain/repositories/supplier';
import { ISupplierEntity } from '@domain/entities/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier';
import { SupplierMapper } from '@presentation/controllers/supplier/mappers/supplier.mapper';

@Injectable()
export class SupplierRepositoryImpl implements SupplierRepository {
  constructor(private readonly supplierDataSource: SupplierDataSourceService) {}

  async createSupplier(
    supplierData: ISupplierEntity,
  ): Promise<ISupplierResponse> {
    const supplier = await this.supplierDataSource.createSupplier(supplierData);
    return SupplierMapper.toResponseDto(supplier);
  }

  async findAll(): Promise<ISupplierResponse[]> {
    const suppliers = await this.supplierDataSource.findAll();
    return suppliers.map(SupplierMapper.toResponseDto);
  }

  async findByParams(params: {
    id?: string;
    documentNumber?: string;
  }): Promise<ISupplierResponse> {
    const supplier = await this.supplierDataSource.findByParams(params);
    return SupplierMapper.toResponseDto(supplier);
  }

  async update(
    id: string,
    supplier: Partial<ISupplierEntity>,
  ): Promise<ISupplierResponse> {
    const updatedSupplier = await this.supplierDataSource.updateSupplier(
      id,
      supplier,
    );
    return SupplierMapper.toResponseDto(updatedSupplier);
  }

  async delete(id: string, userId?: string): Promise<ISupplierResponse> {
    const deletedSupplier = await this.supplierDataSource.deleteSupplier(
      id,
      userId,
    );
    return SupplierMapper.toResponseDto(deletedSupplier);
  }
}
