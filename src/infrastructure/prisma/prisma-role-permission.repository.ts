import { Injectable } from '@nestjs/common';
import { IRolePermissionRepository } from 'src/core/domain/repositories/role-permission.repository';
import { RolePermission } from 'src/core/domain/entities/role-permission.entity';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaRolePermissionRepository implements IRolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async assignPermissions(roleId: string, permissions: { actionId: string; resourceId: string }[]): Promise<RolePermission[]> {
    await this.prisma.rolePermission.createMany({
      data: permissions.map(permission => ({
        roleId,
        actionId: permission.actionId,
        resourceId: permission.resourceId,
      })),
      skipDuplicates: true,
    });

    return this.prisma.rolePermission.findMany({ where: { roleId } });
  }

  async getPermissionsByRole(roleId: string): Promise<RolePermission[]> {
    return this.prisma.rolePermission.findMany({
      where: { roleId },
      include: { action: true, resource: true },
    });
  }

  async removePermission(roleId: string, actionId: string, resourceId: string): Promise<void> {
    await this.prisma.rolePermission.deleteMany({ where: { roleId, actionId, resourceId } });
  }

  async checkPermission(roleId: string, actionId: string, resourceId: string): Promise<boolean> {
    const permission = await this.prisma.rolePermission.findFirst({
      where: { roleId, actionId, resourceId },
    });

    return !!permission;
  }

  async findPermission(roleId: string, actionId: string, resourceId: string): Promise<RolePermission | null> { // 🔹 Implementación agregada
    return this.prisma.rolePermission.findFirst({
      where: { roleId, actionId, resourceId },
    });
  }
}
