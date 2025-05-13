import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IPermissionsPort } from '@domain/ports/access/permissions.port';
import { PermissionsRepository } from '@domain/repositories/access/permissions.repository';
import { ISubresourceEntity } from '@domain/entities/access';
import { ActionLevel } from '@domain/entities/access/action.entity';

@Injectable()
export class PermissionsService implements IPermissionsPort, OnModuleInit {
  private readonly logger = new Logger(PermissionsService.name);

  // Caché de subrecursos para mejorar rendimiento
  private subresourcesCache: Map<string, ISubresourceEntity> = new Map();

  // Caché de resultados de permisos para mejorar rendimiento
  private permissionsCache: Map<string, boolean> = new Map();

  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async onModuleInit() {
    // Cargar el caché de subrecursos al iniciar la aplicación
    // await this.reloadSubresourcesCache();
  }

  /**
   * Recarga el caché de subrecursos
   */
  async reloadSubresourcesCache(): Promise<void> {
    try {
      const subresources =
        await this.permissionsRepository.getAllSubresources();

      // Limpiar caché anterior
      this.subresourcesCache.clear();

      // Llenar nuevo caché
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

  /**
   * Convierte un método HTTP a un nivel de acción
   */
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

  /**
   * Obtiene la clave de caché para un permiso
   */
  private getPermissionCacheKey(
    roleId: string,
    companyId: string,
    controller: string,
    action: string,
  ): string {
    return `${roleId}:${companyId}:${controller}:${action}`;
  }

  /**
   * Verifica si un rol tiene permiso para una acción en un controlador
   */
  async hasPermission(
    roleId: string,
    companyId: string,
    controller: string,
    action: string,
  ): Promise<boolean> {
    try {
      // Crear clave de caché
      const cacheKey = this.getPermissionCacheKey(
        roleId,
        companyId,
        controller,
        action,
      );

      // Verificar si el resultado está en caché
      if (this.permissionsCache.has(cacheKey)) {
        return this.permissionsCache.get(cacheKey) || false;
      }

      // Obtener el subrecurso asociado al controlador
      const subresource = this.subresourcesCache.get(controller);

      if (!subresource) {
        this.logger.warn(
          `No se encontró subrecurso para el controlador: ${controller}`,
        );
        // Guardar en caché y retornar falso
        this.permissionsCache.set(cacheKey, false);
        return false;
      }

      // Obtener el nivel de acción requerido
      const requiredLevel = this.getActionLevelByHttpMethod(action);

      // Verificar si el rol tiene el permiso requerido
      const hasPermission =
        await this.permissionsRepository.hasRoleActionForSubresource(
          roleId,
          subresource.id!,
          requiredLevel,
        );

      // Guardar resultado en caché
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
