import { PrismaClient } from '@prisma/client';
import { rolePermissionInitialData } from '../data/';
import { batchTransactionTolerant } from '../utils/transaction.helper';

type RolePermissionRelation = {
  roleId: string;
  actionId: string;
  subresourceId: string;
};

/**
 * Siembra los datos iniciales de permisos para los roles
 * @param prisma Instancia de PrismaClient configurada
 * @returns Array de permisos creados/actualizados
 */
export async function seedRolePermissions(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de permisos para roles...');

  try {
    // Obtenemos los roles, acciones y subrecursos existentes
    const roles = await prisma.role.findMany();
    const actions = await prisma.action.findMany();
    const subresources = await prisma.subresource.findMany();

    // Mapeamos nombres a IDs para facilitar la búsqueda
    const roleMap = new Map(roles.map(r => [r.name, r.id]));
    const actionMap = new Map(actions.map(a => [a.name, a.id]));
    const subresourceMap = new Map(subresources.map(s => [s.name, s.id]));

    // Recopilamos todas las combinaciones de permisos a crear
    const rolePermissions: RolePermissionRelation[] = [];

    // Procesamos cada rol
    for (const rolePermission of rolePermissionInitialData) {
      const roleId = roleMap.get(rolePermission.roleName);
      if (!roleId) {
        console.warn(`⚠️ No se encontró el rol: ${rolePermission.roleName}`);
        continue;
      }

      // Si es un SUPERADMIN, darle todos los permisos sobre todos los subrecursos
      if (rolePermission.roleName === 'SUPERADMIN') {
        for (const subresource of subresources) {
          for (const action of actions) {
            rolePermissions.push({
              roleId,
              actionId: action.id,
              subresourceId: subresource.id,
            });
          }
        }
      } else {
        // Para los demás roles, solo los permisos específicos
        for (const permission of rolePermission.permissions) {
          const actionId = actionMap.get(permission.actionName);
          const subresourceId = subresourceMap.get(permission.subresourceName);

          if (!actionId || !subresourceId) {
            console.warn(
              `⚠️ No se pudo mapear el permiso: ${permission.subresourceName} - ${permission.actionName} para el rol ${rolePermission.roleName}`
            );
            continue;
          }

          rolePermissions.push({
            roleId,
            actionId,
            subresourceId,
          });
        }
      }
    }

    // Usamos batchTransactionTolerant para continuar si alguno falla
    return batchTransactionTolerant(
      prisma,
      rolePermissions,
      async (tx, permission) => {
        // Verificamos si ya existe el permiso
        const existingPermission = await tx.rolePermission.findUnique({
          where: {
            roleId_actionId_subresourceId: {
              roleId: permission.roleId,
              actionId: permission.actionId,
              subresourceId: permission.subresourceId,
            },
          },
        });

        if (existingPermission) {
          // El permiso ya existe, simplemente lo retornamos
          return existingPermission;
        } else {
          // Creamos el permiso
          return tx.rolePermission.create({
            data: permission,
          });
        }
      },
      {
        isolationLevel: 'ReadCommitted',
      }
    );
  } catch (error) {
    console.error('❌ Error en el seed de permisos para roles:', error);
    return [];
  }
} 