import { Injectable } from '@nestjs/common';
import { RolePermission } from 'src/core/domain/entities';
import { IRolePermissionRepository } from 'src/core/domain/repositories/role-permission.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaRolePermissionRepository implements IRolePermissionRepository {
  constructor(private readonly prisma: PrismaService) { }

  async assignPermissions(
    roleId: string,
    permissions: { actionId: string; subresourceId: string }[],
  ): Promise<RolePermission[]> {
    await this.prisma.rolePermission.createMany({
      data: permissions.map((permission) => ({
        roleId,
        actionId: permission.actionId,
        subresourceId: permission.subresourceId,
      })),
      skipDuplicates: true,
    });

    const result = await this.prisma.rolePermission.findMany({ where: { roleId } });
    return result.map((p) => ({
      roleId: p.roleId,
      actionId: p.actionId,
      subresourceId: p.subresourceId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

  }

  async getPermissionsByRole(roleId: string): Promise<RolePermission[]> {
    const result = await this.prisma.rolePermission.findMany({
      where: { roleId },
      include: { action: true, subresource: true },
    });

    return result.map((p) => ({
      roleId: p.roleId,
      actionId: p.actionId,
      subresourceId: p.subresourceId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

  }

  async removePermission(
    roleId: string,
    actionId: string,
    subresourceId: string,
  ): Promise<void> {
    await this.prisma.rolePermission.deleteMany({
      where: { roleId, actionId, subresourceId },
    });
  }

  async checkPermission(
    roleId: string,
    actionId: string,
    subresourceId: string,
  ): Promise<boolean> {
    const permission = await this.prisma.rolePermission.findFirst({
      where: { roleId, actionId, subresourceId },
    });

    return !!permission;
  }

  async findPermission(
    roleId: string,
    actionId: string,
    subresourceId: string,
  ): Promise<RolePermission | null> {
    const p = await this.prisma.rolePermission.findFirst({
      where: { roleId, actionId, subresourceId },
    });

    return p
      ? {
        roleId: p.roleId,
        actionId: p.actionId,
        subresourceId: p.subresourceId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }
      : null;

  }
}
