import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { Role } from 'src/core/domain/entities/role.entity';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) { }


  async createRole(role: Role): Promise<Role> {
    try {
      const createdRole = await this.prisma.role.create({
        data: {
          id: role.id,
          name: role.name,
        },
      });
      return new Role(createdRole.id, createdRole.name);
    } catch (error) {
      throw error;
    }
  }



  async findById(roleId: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    return role ? new Role(role.id, role.name) : null;
  }


  async deleteRole(id: string): Promise<void> {
    const role = await this.prisma.role.findUnique({ where: { id: id } });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    await this.prisma.role.delete({ where: { id: id } });
  }


  async findAll(page: number, limit: number): Promise<{ role: Omit<Role, 'password'>[], total: number }> {
    const skip = (page - 1) * limit;

    const [role, total] = await Promise.all([
      this.prisma.role.findMany({
        skip,
        take: limit,
        select: { id: true, name: true }
      }),
      this.prisma.role.count()
    ]);

    return { role, total };
  }

  async updateRole(id: string, roleData: Partial<Role>): Promise<Role> {
    const existingRole = await this.findById(id);
    if (!existingRole) throw new NotFoundException(`Tole con ID ${id} no encontrado`);

    const { ...rest } = roleData;
    roleData = rest;


    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: {
        ...roleData,
        name: roleData.name,
      },
    });

    return new Role(updatedRole.id, updatedRole.name);
  }
}