import { Inject, Injectable } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';

@Injectable()
export class AssignApplicationToCompaniesUseCase {
  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(companyIds: string[], applicationIds: string[]): Promise<void> {
    await this.companyRepository.assignApplicationToCompanies(companyIds, applicationIds);
  }
}
