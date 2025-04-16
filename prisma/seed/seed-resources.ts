import { Prisma, PrismaClient } from '@prisma/client';
import { resourceInitialData } from './data/resources.data';
import { Logger } from '@nestjs/common';

export const seedResources = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedResources');
  try {
    logger.log('Iniciando sembrado de recursos...');

    // Verificar si ya existen recursos para evitar duplicados
    const resourceCount = await prisma.resource.count();

    if (resourceCount > 0) {
      logger.log(
        `Ya existen ${resourceCount} recursos en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear recursos desde los datos iniciales
    const results = await Promise.all(
      resourceInitialData.map(async (resourceData) => {
        // Extraer el campo applicationName que no forma parte del modelo Resource
        const { applicationName, ...resourceCreateData } = resourceData;

        try {
          // Crear el recurso
          const resource = await prisma.resource.create({
            data: resourceCreateData,
          });

          return {
            success: true,
            resource,
            applicationName,
          };
        } catch (error: any) {
          logger.error(
            `Error al crear recurso ${resourceData.name}: ${error.message}`,
          );
          return {
            success: false,
            error,
            name: resourceData.name,
            applicationName,
          };
        }
      }),
    );

    // Contar resultados
    const successfulResources = results.filter((r) => r.success) as Array<{
      success: true;
      resource: any;
      applicationName: string;
    }>;

    const failedResources = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
      applicationName: string;
    }>;

    logger.log(
      `Se han creado ${successfulResources.length} recursos con éxito.`,
    );

    if (failedResources.length > 0) {
      logger.warn(`No se pudieron crear ${failedResources.length} recursos.`);
      failedResources.forEach((result) => {
        logger.warn(
          `- Falló al crear: ${result.name} para aplicación ${result.applicationName}`,
        );
      });
    }

    // Mostrar los recursos creados
    const resourcesByApp = new Map<string, number>();

    successfulResources.forEach((result) => {
      if (result.resource) {
        const appName = result.applicationName;
        resourcesByApp.set(appName, (resourcesByApp.get(appName) || 0) + 1);

        logger.log(
          `Recurso creado: ${result.resource.name} (${result.resource.path})`,
        );
        logger.log(`  - Aplicación: ${result.applicationName}`);
      }
    });

    // Resumen por aplicación
    logger.log('Resumen de recursos creados por aplicación:');
    resourcesByApp.forEach((count, appName) => {
      logger.log(`  - ${appName}: ${count} recursos`);
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar recursos: ${error.message}`);
    throw error;
  }
};
