import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { Company } from '@prisma/client';

@Injectable()
export class GetByIdCompanyUseCase {
  private readonly logger = new Logger(GetByIdCompanyUseCase.name);

  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) { }

  async execute(id: string): Promise<Omit<Company, 'createdAt' | 'updatedAt'>> {
    this.logger.log(`Getting company by ID: ${id}`);
    try {
      const company = await this.companyRepository.findById(id);
      if (!company) throw new NotFoundException(`Compañía con ID ${id} no encontrada`);
      return company;
    }
    catch (error) {
      this.logger.error(`Failed to get company by ID: ${id}`, (error as Error).stack);
      throw error;
    }
  }
}
