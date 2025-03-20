import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';

@Injectable()
export class DeleteCompanyUseCase {
  private readonly logger = new Logger(DeleteCompanyUseCase.name);

  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) { }

  async execute(id: string): Promise<void> {
    this.logger.log(`Deleting company ID: ${id}`);
    try {
      const existingCompany = await this.companyRepository.findById(id);
      if (!existingCompany) throw new NotFoundException(`Compañía con ID ${id} no encontrada`);

      await this.companyRepository.deleteCompany(id);
      this.logger.log(`Company ID: ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete company ID: ${id}`, (error as Error).stack);
      throw error;
    }
  }
}
