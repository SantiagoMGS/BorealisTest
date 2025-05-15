import { BadRequestException, Injectable } from '@nestjs/common';
import { SupplierRepository } from '@domain/repositories/supplier';
import { ISupplierEntity } from '@domain/entities/supplier';
import {
  ISupplierResponse,
  IMiningTitleResponse,
} from '@domain/interfaces/supplier';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier';
import { SupplierMapper } from '@presentation/controllers/supplier/mappers/supplier.mapper';
import { PaginationHelper } from '@shared/utils/pagination.helper';
import {
  IPaginatedData,
  IPaginationOptions,
} from '@shared/interfaces/pagination.interfaces';

@Injectable()
export class SupplierRepositoryImpl implements SupplierRepository {
  constructor(private readonly supplierDataSource: SupplierDataSourceService) {}

  async createSupplier(
    supplierData: ISupplierEntity,
  ): Promise<ISupplierResponse> {
    if (!supplierData.shortName) {
      throw new BadRequestException(
        'El nombre corto del proveedor es requerido',
      );
    }
    const supplier = await this.supplierDataSource.createSupplier(supplierData);
    return SupplierMapper.toResponseDto(supplier);
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<IPaginatedData<ISupplierResponse>> {
    const suppliers = await this.supplierDataSource.findAll(options);
    const mappedSuppliers = suppliers.map(SupplierMapper.toResponseDto);
    return PaginationHelper.createPaginatedResponseFromItems(
      mappedSuppliers,
      mappedSuppliers.length,
      options,
    );
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

  async findById(id: string): Promise<ISupplierResponse> {
    const supplier = await this.supplierDataSource.findById(id);
    return SupplierMapper.toResponseDto(supplier);
  }

  async findMiningTitles(supplierId: string): Promise<IMiningTitleResponse[]> {
    return this.supplierDataSource.findMiningTitles(supplierId);
  }
}
