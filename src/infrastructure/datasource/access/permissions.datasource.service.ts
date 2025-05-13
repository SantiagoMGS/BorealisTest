import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { ISubresourceEntity } from '@domain/entities/access';
import { ActionLevel } from '@domain/entities/access/action.entity';

@Injectable()
export class PermissionsDataSource {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSubresources(): Promise<ISubresourceEntity[]> {
    const subresources = await this.prisma.subresource.findMany();

    return subresources.map((subresource) => ({
      id: subresource.id,
      name: subresource.name,
      controller: subresource.controller,
      description: subresource.name, // Usamos name como descripción por ahora
      isActive: true, // Asumimos que todos los existentes están activos
      createdAt: subresource.createdAt,
      updatedAt: subresource.updatedAt,
    }));
  }

  async hasRoleActionForSubresource(
    roleId: string,
    subresourceId: string,
    actionLevel: number,
  ): Promise<boolean> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        roleId,
        subresourceId,
      },
      include: {
        action: true,
      },
    });

    if (!rolePermissions || rolePermissions.length === 0) {
      return false;
    }

    return rolePermissions.some((permission) => {
      const action = permission.action;
      const actionLevelValue =
        action?.level || this.getActionLevelFromId(permission.actionId);
      return actionLevelValue >= actionLevel;
    });
  }

  private getActionLevelFromId(actionId: string): number {
    if (actionId.includes('read')) return ActionLevel.READ;
    if (actionId.includes('create')) return ActionLevel.CREATE;
    if (actionId.includes('update')) return ActionLevel.UPDATE;
    if (actionId.includes('delete')) return ActionLevel.DELETE;
    return ActionLevel.READ; // Por defecto
  }

  getActionLevelByHttpMethod(method: string): number {
    const methodMap: Record<string, number> = {
      GET: ActionLevel.READ,
      POST: ActionLevel.CREATE,
      PUT: ActionLevel.UPDATE,
      PATCH: ActionLevel.UPDATE,
      DELETE: ActionLevel.DELETE,
    };

    return methodMap[method] || ActionLevel.READ;
  }
}
