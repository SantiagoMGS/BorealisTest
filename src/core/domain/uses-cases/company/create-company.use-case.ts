import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCompanyDto } from 'src/presentation/controllers/company/dtos/create-company.dto';
import { Company } from '../../entities';
import { IApplicationRepository } from '../../repositories/application.repository';
import { ICompanyRepository } from '../../repositories/company.repository';

@Injectable()
export class CreateCompanyUseCase {
  private readonly logger = new Logger(CreateCompanyUseCase.name);

  constructor(
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
    @Inject('IApplicationRepository') private readonly applicationRepository: IApplicationRepository,
  ) { }

  async execute(companyDto: CreateCompanyDto): Promise<Company> {
    this.logger.log(`Creating new company "${companyDto.name}"`);

    const existingCompany = await this.companyRepository.findByName(companyDto.name);
    if (existingCompany) {
      throw new ConflictException(`La compañía "${companyDto.name}" ya existe.`);
    }

    // Crear la compañía
    const newCompany = await this.companyRepository.createCompany({
      id: '',
      name: companyDto.name,
      shortName: companyDto.shortName,
      isActive: false,
      isDeleted: false,
    });

    // Crear el branding usando el objeto anidado
    const { branding } = companyDto;
    await this.companyRepository.createCompanyBranding(newCompany.id!, {
      companyId: newCompany.id!,
      logo: branding.logo,
      primaryColor: branding.primaryColor,
      secondaryColor: branding.secondaryColor,
      tertiaryColor: branding.tertiaryColor,
    });

    // Validar que todas las aplicaciones existan
    const applications = await this.applicationRepository.findManyByIds(companyDto.applicationIds);
    if (applications.length !== companyDto.applicationIds.length) {
      throw new ConflictException('Algunas aplicaciones no existen.');
    }

    // Asignar aplicaciones
    await this.companyRepository.assignApplicationToCompanies([newCompany.id!], companyDto.applicationIds);

    this.logger.log(`Company "${companyDto.name}" created successfully`);

    // 🔄 Re-consultar con branding
    const fullCompany = await this.companyRepository.findById(newCompany.id!);
    if (!fullCompany) {
      throw new ConflictException(`La compañía con ID "${newCompany.id}" no se encontró después de la creación.`);
    }
    return fullCompany;

  }
}
