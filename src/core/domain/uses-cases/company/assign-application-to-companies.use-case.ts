import { Inject, Injectable, Logger } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';

@Injectable()
export class AssignApplicationToCompaniesUseCase {
  private readonly logger = new Logger(AssignApplicationToCompaniesUseCase.name);

  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) { }

  async execute(companyIds: string[], applicationIds: string[]): Promise<void> {
    this.logger.log(`Assign aplication ID: ${applicationIds} to company ${companyIds}`);
    try {
      await this.companyRepository.assignApplicationToCompanies(companyIds, applicationIds);
    } catch (error) {
      this.logger.error(`Failed to Assign company ID: ${companyIds}`, (error as Error).stack);
      throw error;
    }

  }
}