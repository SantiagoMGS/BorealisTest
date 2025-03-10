import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { Company } from '../../entities/company.entity';
import { CreateCompanyDto } from 'src/presentation/controllers/dtos/create-company.dto';

@Injectable()
export class CreateCompanyUseCase {
  constructor(@Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository) {}

  async execute(companyDto: CreateCompanyDto): Promise<Company> {
    // Verificar si ya existe una compañía con el mismo nombre
    const existingCompany = await this.companyRepository.findByName(companyDto.name);
    if (existingCompany) {
      throw new ConflictException(`La compañía "${companyDto.name}" ya existe.`);
    }

    //Crear la nueva compañía
    const newCompany = new Company(
      crypto.randomUUID(), // O deja que Prisma genere el ID automáticamente
      companyDto.name,
      companyDto.logo
    );

    await this.companyRepository.createCompany(newCompany);
    return newCompany;
  }
}
