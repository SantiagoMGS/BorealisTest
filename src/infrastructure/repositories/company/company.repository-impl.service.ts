import { CompanyDataSourceService } from '@infrastructure/datasource/company';
import { CompanyRepository } from '@domain/repositories/company/company.repository';
import { Injectable } from '@nestjs/common';
import { ICompanyResponse } from '@domain/interfaces/auth';
import {
  CompanyMapper,
  CompanySupplierMapper,
} from '@presentation/controllers/company/mappers/';
import { NOT_FOUND_COMPANY } from '@shared/constants/not-found-message';
import {
  ICompanySupplierResponse,
  ISuppliersAssignmentResult,
} from '@domain/interfaces/company-supplier';
@Injectable()
export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(private readonly companyDataSource: CompanyDataSourceService) {}

  async findById(id: string): Promise<ICompanyResponse> {
    const company = await this.companyDataSource.findById(id);
    if (!company) {
      throw new Error(NOT_FOUND_COMPANY);
    }
    return CompanyMapper.toResponseDto(company);
  }

  async findAll(): Promise<ICompanyResponse[]> {
    const companies = await this.companyDataSource.findAll();
    return companies.map(CompanyMapper.toResponseDto);
  }

  async assignSuppliers(
    companyId: string,
    supplierIds: string[],
  ): Promise<ISuppliersAssignmentResult> {
    return await this.companyDataSource.assignSuppliers(companyId, supplierIds);
  }

  async getCompanySuppliers(
    companyId: string,
  ): Promise<ICompanySupplierResponse[]> {
    const companySuppliers =
      await this.companyDataSource.getCompanySuppliers(companyId);
    return companySuppliers.map((cs) =>
      CompanySupplierMapper.toResponseDto(cs.company, cs.supplier),
    );
  }
}
