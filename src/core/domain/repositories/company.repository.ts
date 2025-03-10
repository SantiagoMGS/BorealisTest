import { Company } from '../entities/company.entity';

export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>;
  findManyByIds(ids: string[]): Promise<Company[]>;
  createCompany(company: Company): Promise<Company>;
  deleteCompany(id: string): Promise<void>;
  findByName(name: string): Promise<Company | null>; 
}
