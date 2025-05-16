import { CompanyDataSourceService } from '@infrastructure/datasource/company';
import { CompanyRepository } from '@domain/repositories/company/company.repository';
import { Injectable } from '@nestjs/common';
import { ICompanyResponse } from '@domain/interfaces/auth';
import { CompanyMapper } from '@presentation/controllers/company/mappers/';
import { CompanyAllFields } from '@infrastructure/datasource/company/types/company-select.type';

@Injectable()
export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(private readonly companyDataSource: CompanyDataSourceService) {}

  async findById(id: string): Promise<ICompanyResponse> {
    const company = await this.companyDataSource.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }
    return CompanyMapper.toResponseDto(company);
  }

  async findAll(): Promise<ICompanyResponse[]> {
    const companies = await this.companyDataSource.findAll();
    return companies.map(CompanyMapper.toResponseDto);
  }
}
