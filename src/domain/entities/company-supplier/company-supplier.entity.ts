import { ICompanyEntity } from '../company/company.entity';
import { ISupplierEntity } from '../supplier/supplier.entity';

export interface ICompanySupplierEntity {
  id: string;
  companyId: string;
  supplierId: string;
  company: ICompanyEntity;
  supplier: ISupplierEntity;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
