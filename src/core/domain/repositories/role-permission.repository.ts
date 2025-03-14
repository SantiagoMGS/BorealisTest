
import { RolePermission } from '../entities/role-permission.entity';

export interface IRolePermissionRepository {
  assignPermissions(roleId: string, permissions: { actionId: string; subresourceId: string }[]): Promise<RolePermission[]>;
  getPermissionsByRole(roleId: string): Promise<RolePermission[]>;
  removePermission(roleId: string, actionId: string, subresourceId: string): Promise<void>;
  checkPermission(roleId: string, actionId: string, subresourceId: string): Promise<boolean>;
  findPermission(roleId: string, actionId: string, subresourceId: string): Promise<RolePermission | null>; // 🔹 Agregado aquí
}
