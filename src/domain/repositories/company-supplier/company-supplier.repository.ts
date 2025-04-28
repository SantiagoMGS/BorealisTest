import {
  ICompanySupplierResponse,
  ISuppliersAssignmentResult,
} from '@domain/interfaces/company-supplier';

export abstract class ICompanySupplierRepository {
  abstract assignSuppliers(
    companyId: string,
    supplierIds: string[],
  ): Promise<ISuppliersAssignmentResult>;
  abstract getCompanySuppliers(
    companyId: string,
  ): Promise<ICompanySupplierResponse[]>;
}
