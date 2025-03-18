import { Company } from "../entities";

export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>;
  findManyByIds(ids: string[]): Promise<Company[]>;
  createCompany(company: Company): Promise<Company>;
  deleteCompany(id: string): Promise<void>;
  findByName(name: string): Promise<Company | null>; 
  assignApplicationToCompanies(companyIds: string[], applicationIds: string[]): Promise<void>;
  findAll(page: number, limit: number): Promise<{ companies: Company[]; total: number }>;
  updateCompany(id: string, companyData: Partial<Omit<Company, 'createdAt' | 'updatedAt'>>): Promise<Company>;

}
