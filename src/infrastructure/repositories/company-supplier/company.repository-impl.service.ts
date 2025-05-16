import { CompanyDataSourceService } from '@infrastructure/datasource/company';
import { CompanyRepository } from '@domain/repositories/company/company.repository';
import { Injectable } from '@nestjs/common';
import { ICompanyResponse } from '@domain/interfaces/auth';
import { CompanyMapper } from '@presentation/controllers/company/mappers/';
import { NOT_FOUND_COMPANY } from '@shared/constants/not-found-message';
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
}
