import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { Company } from '@prisma/client';

@Injectable()
export class GetByNameCompanyUseCase {
  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(name: string): Promise<Omit<Company, 'createdAt' | 'updatedAt'>> {
    const company = await this.companyRepository.findByName(name);
    if (!company) throw new NotFoundException(`Compañía con nombre ${name} no encontrada`);
    return company;
  }
}
