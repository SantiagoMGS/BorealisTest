import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { Company } from '@prisma/client';

@Injectable()
export class UpdateCompanyUseCase {
  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(id: string, companyData: Partial<Omit<Company,| 'createdAt' | 'updatedAt'>>) {
    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) throw new NotFoundException(`Compañía con ID ${id} no encontrada`);

    return this.companyRepository.updateCompany(id, companyData);
  }
}
