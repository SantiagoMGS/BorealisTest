import { CompanyBranding } from '../entities/company-brand.entity';
import { Company } from '../entities/company.entity';
import { IRepository } from './common/repository.interface';

export interface ICompanyRepository extends IRepository<Company> {
  findByName(name: string): Promise<Company | null>;
  assignApplicationToCompanies(companyIds: string[], applicationIds: string[]): Promise<void>;
  createCompanyBranding(companyId: string, branding: CompanyBranding): Promise<Company>;
  updateCompanyBranding(companyId: string, branding: CompanyBranding): Promise<void>;
  isApplicationAssignedToCompany(companyId: string, applicationId: string): Promise<boolean>;
}