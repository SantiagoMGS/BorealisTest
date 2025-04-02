import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { Company } from '../../entities';

@Injectable()
export class GetByNameCompanyUseCase {
    private readonly logger = new Logger(GetByNameCompanyUseCase.name);
  
  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(name: string): Promise<Omit<Company, 'createdAt' | 'updatedAt'>> {
    this.logger.log(`Getting company by name: ${name}`);
    try {
    const company = await this.companyRepository.findByName(name);
    if (!company) throw new NotFoundException(`Compañía con nombre ${name} no encontrada`);
    return company;
  } catch (error) {
    this.logger.error(`Failed to get company by ID: ${name}`, (error as Error).stack);
    throw error;
  }
  }
}
