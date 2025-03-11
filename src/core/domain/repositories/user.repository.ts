import { User } from '../entities/user.entity';

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  deleteUser(id: string): Promise<void>;
  findAll(page: number, limit: number): Promise<{ users: Omit<User, 'password'>[], total: number }>;
  update(id: string, userData: Partial<User>): Promise<User>;
  assignUserToCompanies(userId: string, companyIds: string[], roleId: string): Promise<void>;
}
