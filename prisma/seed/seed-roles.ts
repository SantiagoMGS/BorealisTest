import { PrismaClient } from '@prisma/client';
import { roleInitialData } from './data/roles.data';
import { Logger } from '@nestjs/common';

export const seedRoles = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedRoles');
  try {
    logger.log('Iniciando sembrado de roles...');

    // Verificar si ya existen roles para evitar duplicados
    const roleCount = await prisma.role.count();

    if (roleCount > 0) {
      logger.log(
        `Ya existen ${roleCount} roles en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    const results = await Promise.all(
      roleInitialData.map(async (roleData) => {
        return prisma.role
          .create({
            data: roleData,
          })
          .then((role) => ({ success: true, role }))
          .catch((error) => {
            logger.error(
              `Error al crear rol ${roleData.name}: ${error.message}`,
            );
            return { success: false, error, name: roleData.name };
          });
      }),
    );

    // Contar resultados
    const successfulRoles = results.filter((r) => r.success) as Array<{
      success: true;
      role: any;
    }>;
    const failedRoles = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(`Se han creado ${successfulRoles.length} roles con éxito.`);

    if (failedRoles.length > 0) {
      logger.warn(`No se pudieron crear ${failedRoles.length} roles.`);
      failedRoles.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar los roles creados
    successfulRoles.forEach((result) => {
      if (result.role) {
        logger.log(`Rol creado: ${result.role.name}`);
        logger.log(`  - Descripción: ${result.role.description}`);
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar roles: ${error.message}`);
    throw error;
  }
};
