import { User } from "../entities";
import { UserPermissionsEntity } from "../entities/user-permissions.entity";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  findByEmail(email: string): Promise<Omit<User, 'password'> | null>;
  deleteUser(id: string): Promise<void>;
  findAll(
    page: number,
    limit: number,
  ): Promise<{ users: Omit<User, 'password'>[]; total: number }>;
  update(id: string, userData: Partial<User>): Promise<User>;
  assignUserToCompanies(
    userId: string,
    permissions: { companyId: string; roleId: string }[],
  ): Promise<void>;
  updateUserRole(
    userId: string,
    companyId: string,
    roleId: string,
  ): Promise<void>;
  getUserPermissions(userId: string): Promise<UserPermissionsEntity[]>;
  updateRefreshToken(
    userId: string,
    refreshToken: string,
    expiry: Date
  ): Promise<void>;
  findUserByRefreshToken(
    refreshToken: string
  ): Promise<Omit<User, 'password'> | null>;


  clearRefreshToken(userId: string): Promise<void>;

}
