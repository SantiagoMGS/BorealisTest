import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { applicationResourceInitialData } from './data/';

export const seedApplicationResources = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedApplicationResources');
  try {
    logger.log('Iniciando sembrado de recursos para aplicaciones...');

    // Verificar si ya existen relaciones de aplicaciones-recursos
    const applicationResourceCount = await prisma.applicationResource.count();

    if (applicationResourceCount > 0) {
      logger.log(
        `Ya existen ${applicationResourceCount} relaciones de aplicaciones-recursos en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Obtener todas las aplicaciones y recursos para relacionarlos
    const applications = await prisma.application.findMany();
    const resources = await prisma.resource.findMany();

    const applicationsMap = new Map(
      applications.map((app) => [app.name, app.id]),
    );
    const resourcesMap = new Map(resources.map((res) => [res.name, res.id]));

    // Procesar cada aplicación
    for (const appResource of applicationResourceInitialData) {
      // Buscar la aplicación por nombre
      const applicationId = applicationsMap.get(appResource.applicationName);

      if (!applicationId) {
        logger.error(
          `No se encontró la aplicación: ${appResource.applicationName}`,
        );
        continue;
      }

      logger.log(`Procesando recursos para: ${appResource.applicationName}`);

      // Procesar cada recurso para esta aplicación
      const results = await Promise.all(
        appResource.resourceNames.map(async (resourceName) => {
          try {
            const resourceId = resourcesMap.get(resourceName);

            if (!resourceId) {
              logger.warn(`No se encontró el recurso: ${resourceName}`);
              return { success: false, resourceName, reason: 'not_found' };
            }

            // Crear la relación entre aplicación y recurso
            await prisma.applicationResource.create({
              data: {
                applicationId,
                resourceId,
                isActive: true,
              },
            });

            return { success: true, resourceName };
          } catch (error: any) {
            logger.error(
              `Error al vincular recurso ${resourceName}: ${error.message}`,
            );
            return { success: false, resourceName, error, reason: 'error' };
          }
        }),
      );

      // Mostrar resultados para esta aplicación
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      logger.log(
        `  ✓ ${successCount} recursos vinculados a ${appResource.applicationName}`,
      );
      if (failCount > 0) {
        logger.warn(`  ✗ ${failCount} recursos fallaron al vincularse`);
        results
          .filter((r) => !r.success)
          .forEach((r) =>
            logger.warn(
              `    - ${r.resourceName} (${r.reason === 'not_found' ? 'No encontrado' : 'Error'})`,
            ),
          );
      }
    }

    // Mostrar resumen final
    const totalCount = await prisma.applicationResource.count();
    logger.log(
      `Sembrado completado. ${totalCount} relaciones aplicación-recurso creadas.`,
    );
  } catch (error: any) {
    logger.error(
      `Error general al sembrar recursos de aplicaciones: ${error.message}`,
    );
    throw error;
  }
};
