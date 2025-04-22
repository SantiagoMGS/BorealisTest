import { ISupplierEntity } from '@domain/entities/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';

export abstract class SupplierRepository {
  abstract createSupplier(
    supplierData: ISupplierEntity,
  ): Promise<ISupplierResponse>;
}
