export interface IRolePermissionEntity {
  id?: string;
  roleId: string;
  subresourceId: string;
  actionId: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
