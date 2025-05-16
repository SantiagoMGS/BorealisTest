import { ICompanyResponse } from '@domain/interfaces/auth';

export abstract class CompanyRepository {
  abstract findById(id: string): Promise<ICompanyResponse>;
  abstract findAll(): Promise<ICompanyResponse[]>;
}
