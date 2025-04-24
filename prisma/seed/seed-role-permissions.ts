import { PrismaClient } from '@prisma/client';
import { rolePermissionInitialData } from './data/';
import { Logger } from '@nestjs/common';

export const seedRolePermissions = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedRolePermissions');
  try {
    logger.log('Iniciando sembrado de permisos para roles...');

    // Verificar si ya existen permisos de roles
    const rolePermissionCount = await prisma.rolePermission.count();

    if (rolePermissionCount > 0) {
      logger.log(
        `Ya existen ${rolePermissionCount} permisos de roles en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Obtener roles, recursos, subrecursos y acciones para mapearlos por nombre
    const roles = await prisma.role.findMany();
    const resources = await prisma.resource.findMany();
    const subresources = await prisma.subresource.findMany();
    const actions = await prisma.action.findMany();

    // Crear mapas para búsqueda rápida por nombre
    const rolesMap = new Map(roles.map((role) => [role.name, role.id]));
    const resourcesMap = new Map(
      resources.map((resource) => [resource.name, resource.id]),
    );
    const actionsMap = new Map(
      actions.map((action) => [action.name, action.id]),
    );

    // Mapa especial para subrecursos que combina nombre del subrecurso y nombre del recurso
    const subresourcesMap = new Map();
    subresources.forEach((subresource) => {
      const resource = resources.find((r) => r.id === subresource.resourceId);
      if (resource) {
        const key = `${subresource.name}:${resource.name}`;
        subresourcesMap.set(key, subresource.id);
      }
    });

    // Función para asignar permisos DELETE a un rol en todos los subrecursos
    const assignFullPermissions = async (
      roleName: string,
      roleId: string,
      actionId: string,
    ) => {
      logger.log(`Asignando permisos completos al rol ${roleName}...`);

      for (const subresource of subresources) {
        try {
          await prisma.rolePermission.create({
            data: {
              roleId: roleId,
              actionId: actionId,
              subresourceId: subresource.id,
            },
          });
        } catch (error: any) {
          logger.error(
            `Error al crear permiso para ${roleName} en subrecurso ${subresource.name}: ${error.message}`,
          );
        }
      }
    };

    // Para los roles con permisos completos
    const adminRoleId = rolesMap.get('ADMIN');
    const superAdminRoleId = rolesMap.get('SUPER_ADMIN');
    const deleteActionId = actionsMap.get('DELETE');

    if (deleteActionId) {
      // Asignar permisos completos a ADMIN
      if (adminRoleId) {
        await assignFullPermissions('ADMIN', adminRoleId, deleteActionId);
      }

      // Asignar permisos completos a SUPER_ADMIN
      if (superAdminRoleId) {
        await assignFullPermissions(
          'SUPER_ADMIN',
          superAdminRoleId,
          deleteActionId,
        );
      }
    }

    // Procesar cada rol y sus permisos (excepto ADMIN y SUPER_ADMIN que ya se procesaron)
    for (const roleData of rolePermissionInitialData.filter(
      (r) => r.roleName !== 'ADMIN' && r.roleName !== 'SUPER_ADMIN',
    )) {
      const roleId = rolesMap.get(roleData.roleName);

      if (!roleId) {
        logger.warn(`No se encontró el rol: ${roleData.roleName}`);
        continue;
      }

      logger.log(`Procesando permisos para rol: ${roleData.roleName}`);

      const results = await Promise.all(
        roleData.permissions.map(async (permission) => {
          try {
            const { subresourceName, resourceName, actionName } = permission;

            // Buscar IDs correspondientes
            const actionId = actionsMap.get(actionName);
            const subresourceId = subresourcesMap.get(
              `${subresourceName}:${resourceName}`,
            );

            if (!actionId) {
              return {
                success: false,
                message: `Acción no encontrada: ${actionName}`,
                permission,
              };
            }

            if (!subresourceId) {
              return {
                success: false,
                message: `Subrecurso no encontrado: ${subresourceName} en recurso ${resourceName}`,
                permission,
              };
            }

            // Crear permiso
            await prisma.rolePermission.create({
              data: {
                roleId,
                actionId,
                subresourceId,
              },
            });

            return {
              success: true,
              permission,
            };
          } catch (error: any) {
            return {
              success: false,
              message: error.message,
              permission,
            };
          }
        }),
      );

      // Contar resultados
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      logger.log(
        `  ✓ ${successCount} permisos creados para rol ${roleData.roleName}`,
      );

      if (failCount > 0) {
        logger.warn(`  ✗ ${failCount} permisos fallaron al crearse`);
        results
          .filter((r) => !r.success)
          .forEach((r) => {
            logger.warn(`    - Error: ${r.message}`);
            logger.warn(
              `      Subrecurso: ${r.permission.subresourceName}, Recurso: ${r.permission.resourceName}, Acción: ${r.permission.actionName}`,
            );
          });
      }
    }

    // Mostrar resumen final
    const finalCount = await prisma.rolePermission.count();
    logger.log(`Sembrado completado. ${finalCount} permisos de roles creados.`);
  } catch (error: any) {
    logger.error(
      `Error general al sembrar permisos de roles: ${error.message}`,
    );
    throw error;
  }
};
