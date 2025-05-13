export interface IAuthUser {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  companyId?: string;
  roleId?: string;
}
