import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { Company } from '@prisma/client';

@Injectable()
export class GetByIdCompanyUseCase {
  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(id: string): Promise<Omit<Company, 'createdAt' | 'updatedAt'>> {
    const company = await this.companyRepository.findById(id);
    if (!company) throw new NotFoundException(`Compañía con ID ${id} no encontrada`);

    return company;
  }
}
