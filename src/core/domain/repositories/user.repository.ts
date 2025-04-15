import { UserCompanyPermissionsEntity } from '../entities/user-company-permissions.entity';
import { UserPermissionsEntity } from '../entities/user-permissions.entity';
import { User } from '../entities/user.entity';
import { IRepository } from './common/repository.interface';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<Omit<User, 'hashedPassword'> | null>;
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
  getUserCompanyPermissions(
    userId: string,
    companyId: string,
  ): Promise<UserCompanyPermissionsEntity>;
  updateRefreshToken(
    userId: string,
    refreshToken: string,
    expiry: Date,
  ): Promise<void>;
  findUserByRefreshToken(
    refreshToken: string,
  ): Promise<Omit<User, 'hashedPassword'> | null>;
  clearRefreshToken(userId: string): Promise<void>;
}
