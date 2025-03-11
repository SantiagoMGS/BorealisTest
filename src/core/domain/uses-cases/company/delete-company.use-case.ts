import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';

@Injectable()
export class DeleteCompanyUseCase {
  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) throw new NotFoundException(`Compañía con ID ${id} no encontrada`);

    await this.companyRepository.deleteCompany(id);
  }
}
