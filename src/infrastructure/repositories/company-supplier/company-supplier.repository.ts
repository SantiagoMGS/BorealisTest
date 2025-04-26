import { Injectable } from '@nestjs/common';
import { ICompanySupplierRepository } from '@domain/repositories/company-supplier/company-supplier.repository';
import { CompanySupplierDataSourceService } from '@infrastructure/datasource/company-supplier';
import { ICompanySupplierResponse } from '@domain/interfaces/company-supplier';
import { CompanySupplierMapper } from '@presentation/controllers/company/mappers/company-supplier.mapper';

@Injectable()
export class CompanySupplierRepositoryImpl
  implements ICompanySupplierRepository
{
  constructor(
    private readonly companySupplierDataSource: CompanySupplierDataSourceService,
  ) {}

  async assignSuppliers(
    companyId: string,
    supplierIds: string[],
  ): Promise<void> {
    await this.companySupplierDataSource.assignSuppliers(
      companyId,
      supplierIds,
    );
  }

  async getCompanySuppliers(
    companyId: string,
  ): Promise<ICompanySupplierResponse[]> {
    const companySuppliers =
      await this.companySupplierDataSource.getCompanySuppliers(companyId);
    return companySuppliers.map((cs) =>
      CompanySupplierMapper.toResponseDto(cs.company, cs.supplier),
    );
  }
}
