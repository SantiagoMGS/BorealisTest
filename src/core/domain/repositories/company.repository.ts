import { Company } from "../entities/company.entity";

export interface ICompanyRepository {
  createCompany(company: Company): Promise<Company>;
  deleteCompany(id: string): Promise<void>;
  updateCompany(id: string, company: Partial<Company>): Promise<Company>;
}