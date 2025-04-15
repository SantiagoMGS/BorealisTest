import { Module } from '@nestjs/common';
import {
  AssignApplicationToCompaniesUseCase,
  CreateCompanyUseCase,
  DeleteCompanyUseCase,
  GetAllCompaniesUseCase,
  GetByIdCompanyUseCase,
  GetByNameCompanyUseCase,
  UpdateCompanyUseCase,
} from 'src/core/domain/uses-cases';
import { CompanyController } from '../../controllers/company/company.controller';
import { RepositoryModule } from '../repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [CompanyController],
  providers: [
    CreateCompanyUseCase,
    GetByIdCompanyUseCase,
    GetByNameCompanyUseCase,
    GetAllCompaniesUseCase,
    AssignApplicationToCompaniesUseCase,
    DeleteCompanyUseCase,
    UpdateCompanyUseCase,
  ],
  exports: [
    CreateCompanyUseCase,
    GetByIdCompanyUseCase,
    GetByNameCompanyUseCase,
    GetAllCompaniesUseCase,
    AssignApplicationToCompaniesUseCase,
    DeleteCompanyUseCase,
    UpdateCompanyUseCase,
  ],
})
export class CompanyModule {} 