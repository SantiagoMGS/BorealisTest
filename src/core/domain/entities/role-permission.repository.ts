import { RolePermission } from '../entities/role-permission.entity';

export interface IRolePermissionRepository {
  assignPermissions(roleId: string, permissions: { actionId: string; resourceId: string }[]): Promise<RolePermission[]>;
  getPermissionsByRole(roleId: string): Promise<RolePermission[]>;
  removePermission(roleId: string, actionId: string, resourceId: string): Promise<void>;
  checkPermission(roleId: string, actionId: string, resourceId: string): Promise<boolean>;
}
