import { Inject, Injectable, Logger } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { Company } from '../../entities';

@Injectable()
export class GetAllCompaniesUseCase {
  private readonly logger = new Logger(GetAllCompaniesUseCase.name);

  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) { }

  async execute(page: number, limit: number): Promise<{ companies: Company[], total: number }> {
    this.logger.log(`Getting all companies with page: ${page}, limit: ${limit}`);

    try {
      return this.companyRepository.findAll(page, limit);
    } catch (error) {
      this.logger.error('Failed to get all companys', (error as Error).stack);
      throw error;

    }
  }
}