import { Injectable } from '@nestjs/common';
import { Role } from 'src/core/domain/entities';
import { IRoleRepository } from 'src/core/domain/repositories/role.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Role): Promise<Role> {

    const created = await this.prisma.role.create({ data: { name: data.name } });
    return { id: created.id, name: created.name };
  }

  async findById(id: string): Promise<Role | null> {
    const found = await this.prisma.role.findUnique({ where: { id } });
    return found ? { id: found.id, name: found.name } : null;
  }

  async findAll(page: number, limit: number): Promise<{ data: Role[]; total: number }> {
    const skip = (page - 1) * limit;
    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({ skip, take: limit }),
      this.prisma.role.count(),
    ]);
    return {
      data: roles.map((r) => ({ id: r.id, name: r.name })),
      total,
    };
  }

  async update(id: string, data: Partial<Role>): Promise<Role> {
    const updated = await this.prisma.role.update({ where: { id }, data });
    return { id: updated.id, name: updated.name };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.role.delete({ where: { id } });
  }

  async findByName(name: string): Promise<Role | null> {
    const found = await this.prisma.role.findUnique({ where: { name } });
    return found ? { id: found.id, name: found.name } : null;
  }
}
