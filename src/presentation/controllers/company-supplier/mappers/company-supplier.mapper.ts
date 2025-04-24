import { ICompanySupplierResponse } from '@domain/interfaces/company-supplier';
import { Company, Supplier } from '@prisma/client';

export class CompanySupplierMapper {
  static toResponseDto(
    company: Company,
    supplier: Supplier,
  ): ICompanySupplierResponse {
    return {
      company: {
        id: company.id,
        name: company.name,
        shortName: company.shortName,
      },
      supplier: {
        id: supplier.id,
        name: supplier.name,
        documentNumber: supplier.documentNumber,
      },
    };
  }
}
