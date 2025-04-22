import { ISupplierEntity } from '@domain/entities/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';

export abstract class SupplierRepository {
  abstract createSupplier(
    supplierData: ISupplierEntity,
  ): Promise<ISupplierResponse>;
  abstract findAll(): Promise<ISupplierResponse[]>;
  abstract findByParams(params: {
    id?: string;
    documentNumber?: string;
  }): Promise<ISupplierResponse>;
  abstract update(
    id: string,
    supplier: Partial<ISupplierEntity>,
  ): Promise<ISupplierResponse>;
  abstract delete(id: string, userId?: string): Promise<ISupplierResponse>;
}
