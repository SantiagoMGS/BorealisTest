import { User } from "../entities";

export interface ILoginRepository {
  findByEmail(email: string): Promise<Omit<User, 'password' | 'refreshToken' | 'refreshTokenExpired'>>;
  findByEmailWithPassword(email: string): Promise<Omit<User, 'refreshToken' | 'refreshTokenExpired'>>;
  getCompanyByUserId(
    userId: string,
  ): Promise<{ companyId: string; companyName: string; logo: string }[]>;
}
