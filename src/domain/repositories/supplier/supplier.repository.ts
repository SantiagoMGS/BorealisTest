import { ISupplierEntity } from '@domain/entities/supplier';
import {
  ISupplierResponse,
  IMiningTitleResponse,
} from '@domain/interfaces/supplier';

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
  abstract findById(id: string): Promise<ISupplierResponse>;
  abstract findMiningTitles(
    supplierId: string,
  ): Promise<IMiningTitleResponse[]>;
}
