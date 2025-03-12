import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { Role } from 'src/core/domain/entities/role.entity';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(role: Role): Promise<Role> {
    const createdRole = await this.prisma.role.create({
      data: { name: role.name },
    });
    return new Role(createdRole.id, createdRole.name);
  }

  async findById(id: string): Promise<Role | null> {  
    const role = await this.prisma.role.findUnique({ where: { id } });
    return role ? new Role(role.id, role.name) : null;
  }
  async findByName(name: string): Promise<Role | null> {  
    const role = await this.prisma.role.findUnique({ where: { name } });
    return role ? new Role(role.id, role.name) : null;
  }

  async findAll(page: number, limit: number): Promise<{ roles: Role[]; total: number }> {
    const skip = (page - 1) * limit;

    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({
        skip,
        take: limit,
        select: { id: true, name: true },
      }),
      this.prisma.role.count(),
    ]);

    return { roles, total };
  }

  async updateRole(id: string, roleData: Partial<Role>): Promise<Role> {
    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: { name: roleData.name },
    });
    return new Role(updatedRole.id, updatedRole.name);
  }

  async deleteRole(id: string): Promise<string> {
    await this.prisma.role.delete({ where: { id } });
    return 'Role deleted successfully';
  }
}
