import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { ISubresourceEntity } from '@domain/entities/access';
import { ActionLevel } from '@domain/entities/access/action.entity';

@Injectable()
export class PermissionsDataSource {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los subrecursos activos
   */
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

  /**
   * Verifica si un rol tiene una acción de nivel suficiente para un subrecurso específico
   */
  async hasRoleActionForSubresource(
    roleId: string,
    subresourceId: string,
    actionLevel: number,
  ): Promise<boolean> {
    // Buscar todas las acciones asignadas a este rol para este subrecurso
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        roleId,
        subresourceId,
      },
      include: {
        action: true,
      },
    });

    // Si no hay permisos asignados, no tiene acceso
    if (!rolePermissions || rolePermissions.length === 0) {
      return false;
    }

    // Verificar si alguna de las acciones asignadas tiene un nivel mayor o igual al requerido
    // Ajustamos para obtener el nivel de la acción desde su relación
    return rolePermissions.some((permission) => {
      const action = permission.action;
      // Asumimos que tenemos una propiedad level en la acción o la extraemos del id
      const actionLevelValue =
        action?.level || this.getActionLevelFromId(permission.actionId);
      return actionLevelValue >= actionLevel;
    });
  }

  /**
   * Método auxiliar para extraer el nivel de acción desde el ID si es necesario
   * Esto es temporal hasta que se ajuste el esquema de la base de datos
   */
  private getActionLevelFromId(actionId: string): number {
    // Lógica para extraer el nivel basado en el ID o nombre de acción
    // Implementación simple de ejemplo
    if (actionId.includes('read')) return ActionLevel.READ;
    if (actionId.includes('create')) return ActionLevel.CREATE;
    if (actionId.includes('update')) return ActionLevel.UPDATE;
    if (actionId.includes('delete')) return ActionLevel.DELETE;
    return ActionLevel.READ; // Por defecto
  }

  /**
   * Obtiene el nivel de acción basado en el método HTTP
   */
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
