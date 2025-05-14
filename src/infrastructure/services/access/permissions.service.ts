import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IPermissionsPort } from '@domain/ports/access/permissions.port';
import { PermissionsRepository } from '@domain/repositories/access/permissions.repository';
import { ISubresourceEntity } from '@domain/entities/access';
import { ActionLevel } from '@domain/entities/access/action.entity';

@Injectable()
export class PermissionsService implements IPermissionsPort, OnModuleInit {
  private readonly logger = new Logger(PermissionsService.name);

  private subresourcesCache: Map<string, ISubresourceEntity> = new Map();

  private permissionsCache: Map<string, boolean> = new Map();

  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async onModuleInit() {
    await this.reloadSubresourcesCache();
  }

  async reloadSubresourcesCache(): Promise<void> {
    try {
      const subresources =
        await this.permissionsRepository.getAllSubresources();

      this.subresourcesCache.clear();

      subresources.forEach((subresource) => {
        this.subresourcesCache.set(subresource.controller, subresource);
      });

      this.logger.log(
        `Caché de subrecursos recargado: ${subresources.length} subrecursos`,
      );
    } catch (error) {
      this.logger.error('Error al recargar el caché de subrecursos', error);
      throw error;
    }
  }

  private getActionLevelByHttpMethod(method: string): number {
    const methodMap: Record<string, number> = {
      GET: ActionLevel.READ,
      POST: ActionLevel.CREATE,
      PUT: ActionLevel.UPDATE,
      PATCH: ActionLevel.UPDATE,
      DELETE: ActionLevel.DELETE,
    };

    return methodMap[method.toUpperCase()] || ActionLevel.READ;
  }

  private getPermissionCacheKey(
    roleId: string,
    companyId: string,
    controller: string,
    action: string,
  ): string {
    return `${roleId}:${companyId}:${controller}:${action}`;
  }

  async hasPermission(
    roleId: string,
    companyId: string,
    controller: string,
    action: string,
  ): Promise<boolean> {
    try {
      const cacheKey = this.getPermissionCacheKey(
        roleId,
        companyId,
        controller,
        action,
      );

      if (this.permissionsCache.has(cacheKey)) {
        return this.permissionsCache.get(cacheKey) || false;
      }

      const subresource = this.subresourcesCache.get(controller);

      if (!subresource) {
        this.logger.warn(
          `No se encontró subrecurso para el controlador: ${controller}`,
        );
        this.permissionsCache.set(cacheKey, false);
        return false;
      }

      const requiredLevel = this.getActionLevelByHttpMethod(action);

      const hasPermission =
        await this.permissionsRepository.hasRoleActionForSubresource(
          roleId,
          subresource.id!,
          requiredLevel,
        );

      this.permissionsCache.set(cacheKey, hasPermission);

      return hasPermission;
    } catch (error) {
      this.logger.error(
        `Error al verificar permisos: roleId=${roleId}, controller=${controller}, action=${action}`,
        error,
      );
      return false;
    }
  }
}
