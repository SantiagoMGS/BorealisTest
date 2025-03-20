import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { Company } from '@prisma/client';

@Injectable()
export class UpdateCompanyUseCase {
  private readonly logger = new Logger(UpdateCompanyUseCase.name);

  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) { }

  async execute(id: string, companyData: Partial<Omit<Company, | 'createdAt' | 'updatedAt'>>) {
    this.logger.log(`Updating Company ID: ${id}`);

    try {
      const existingCompany = await this.companyRepository.findById(id);
      if (!existingCompany) throw new NotFoundException(`Compañía con ID ${id} no encontrada`);

      const updateCompany = this.companyRepository.updateCompany(id, companyData);
      this.logger.log(`Company ID: ${id} updated successfully`);
      return updateCompany
    } catch (error ) {
      this.logger.error(`Failed to update company ID: ${id}`, (error as Error).stack);
      throw error;
    }
  }
}
