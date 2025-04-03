export type RolePermission = {
  roleId: string,
  actionId: string,
  subresourceId: string,
  createdAt?: Date,
  updatedAt?: Date,
  createdBy?: string,
  updatedBy?: string,
}