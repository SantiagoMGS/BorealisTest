import { ICompanyResponse } from '@domain/interfaces';
import { CompanyRepository } from '@domain/repositories/company/company.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindCompanyByIdUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(id: string): Promise<ICompanyResponse> {
    return this.companyRepository.findById(id);
  }
}
