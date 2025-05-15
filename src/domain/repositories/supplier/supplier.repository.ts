import { ISupplierEntity } from '@domain/entities/supplier';
import {
  ISupplierResponse,
  IMiningTitleResponse,
} from '@domain/interfaces/supplier';
import {
  IPaginatedData,
  IPaginationOptions,
} from '@shared/interfaces/pagination.interfaces';

export abstract class SupplierRepository {
  abstract createSupplier(
    supplierData: ISupplierEntity,
  ): Promise<ISupplierResponse>;
  abstract findAll(
    options: IPaginationOptions,
  ): Promise<IPaginatedData<ISupplierResponse>>;
  abstract findByParams(params: {
    id?: string;
    documentNumber?: string;
  }): Promise<ISupplierResponse>;
  abstract update(
    id: string,
    supplier: Partial<ISupplierEntity>,
  ): Promise<ISupplierResponse>;
  abstract delete(id: string, userId?: string): Promise<ISupplierResponse>;
  abstract findById(id: string): Promise<ISupplierResponse>;
}
