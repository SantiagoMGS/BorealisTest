import { User } from "../entities";

export interface ILoginRepository {
  findByEmail(email: string): Promise<Omit<User, 'password'> | null>;
  findByEmailWithPassword(email: string): Promise<User | null>;
  getCompanyByUserId(
    userId: string,
  ): Promise<{ companyId: string; companyName: string; logo: string }[]>;
}
