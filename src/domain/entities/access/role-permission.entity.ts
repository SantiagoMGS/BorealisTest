/**
 * Representa un permiso asignado a un rol para un subrecurso y acción específica
 */
export interface IRolePermissionEntity {
  id?: string;
  roleId: string;
  subresourceId: string;
  actionId: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
