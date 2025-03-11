import { Inject, Injectable } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { Company } from '@prisma/client';

@Injectable()
export class GetAllCompaniesUseCase {
  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) { }

  async execute(page: number, limit: number): Promise<{ companies: Omit<Company, 'createdAt' | 'updatedAt'>[]; total: number }> {
    return this.companyRepository.findAll(page, limit);
  }
}
