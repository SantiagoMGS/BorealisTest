import { ICompanyResponse } from '@domain/interfaces/auth';

export abstract class ICompanyRepository {
  abstract findById(id: string): Promise<ICompanyResponse | null>;
  abstract findAll(): Promise<ICompanyResponse[]>;
}
