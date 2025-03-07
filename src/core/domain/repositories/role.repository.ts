import { Role } from "../entities/role.entity";

export interface IRoleRepository {
  createRole(user: Role): Promise<Role>;
  deleteRole(id: string): Promise<void>;
  update(id: string, userRole: Partial<Role>): Promise<Role>;
}