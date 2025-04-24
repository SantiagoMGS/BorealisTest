import { ICompanySupplierResponse } from '@domain/interfaces/company-supplier';

export abstract class ICompanySupplierRepository {
  abstract assignSuppliers(
    companyId: string,
    supplierIds: string[],
  ): Promise<void>;
  abstract getCompanySuppliers(
    companyId: string,
  ): Promise<ICompanySupplierResponse[]>;
}
