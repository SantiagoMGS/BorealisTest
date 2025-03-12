import { Role } from '../entities/role.entity';

export interface IRoleRepository {
  createRole(role: Role): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByName(id: string): Promise<Role | null>;
  findAll(page: number, limit: number): Promise<{ roles: Role[]; total: number }>;
  updateRole(id: string, roleData: Partial<Role>): Promise<Role>;
  deleteRole(id: string): Promise<string>;
}
