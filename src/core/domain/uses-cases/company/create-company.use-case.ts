import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { IApplicationRepository } from '../../repositories/application.repository';
import { Company } from '../../entities/company.entity';
import { CreateCompanyDto } from 'src/presentation/controllers/company/dtos/create-company.dto';

@Injectable()
export class CreateCompanyUseCase {
  private readonly logger = new Logger(CreateCompanyDto.name);

  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
    @Inject('IApplicationRepository') private readonly applicationRepository: IApplicationRepository, // 🔹 Repositorio de aplicaciones
  ) { }

  async execute(companyDto: CreateCompanyDto): Promise<Company> {
    this.logger.log('Creating new company');
    try {
      const existingCompany = await this.companyRepository.findByName(companyDto.name);
      if (existingCompany) {
        throw new ConflictException(`La compañía "${companyDto.name}" ya existe.`);
      }

      const newCompany = await this.companyRepository.createCompany(
        new Company('', companyDto.name, companyDto.logo)
      );

      // Verificar que todas las aplicaciones existan
      const applications = await this.applicationRepository.findManyByIds(companyDto.applicationIds);
      if (applications.length !== companyDto.applicationIds.length) {
        throw new ConflictException(`Algunas aplicaciones no existen.`);
      }

      // Asignar aplicaciones a la compañía
      await this.companyRepository.assignApplicationToCompanies([newCompany.id], companyDto.applicationIds);
      this.logger.log('Company created successfully');
      return newCompany;

    } catch (error) {
      this.logger.error('Failed to create company', error.stack);
      throw error;
    }

  }
}
