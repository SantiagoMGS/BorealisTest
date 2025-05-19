import { ICompanyResponse } from '@domain/interfaces/auth';
import {
  ISuppliersAssignmentResult,
  ICompanySupplierResponse,
} from '@domain/interfaces/company-supplier';

export abstract class CompanyRepository {
  abstract findById(id: string): Promise<ICompanyResponse>;
  abstract findAll(): Promise<ICompanyResponse[]>;
  abstract assignSuppliers(
    companyId: string,
    supplierIds: string[],
  ): Promise<ISuppliersAssignmentResult>;
  abstract getCompanySuppliers(
    companyId: string,
  ): Promise<ICompanySupplierResponse[]>;
}
