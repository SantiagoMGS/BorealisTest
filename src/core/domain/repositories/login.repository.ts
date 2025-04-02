import { User } from "../entities";

export interface ILoginRepository {
  findByEmail(email: string): Promise<Omit<User, 'hashedPassword' | 'refreshToken' | 'refreshTokenExpired'>>;
  findByEmailWithPassword(email: string): Promise<Omit<User, 'refreshToken' | 'refreshTokenExpired'>>;
  getCompanyByUserId(userId: string): Promise<{
    id: string;
    name: string;
    branding: {
      logo: string | null;
      primaryColor: string | null;
      secondaryColor: string | null;
      tertiaryColor: string | null;
    } | null;
  }[]>;
}