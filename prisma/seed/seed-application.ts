import { Prisma, PrismaClient } from '@prisma/client';
import { applicationInitialData } from './data/applications.data';
import { Logger } from '@nestjs/common';

export const seedApplications = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedApplications');
  try {
    logger.log('Iniciando sembrado de aplicaciones...');

    // Verificar si ya existen aplicaciones para evitar duplicados
    const applicationCount = await prisma.application.count();

    if (applicationCount > 0) {
      logger.log(
        `Ya existen ${applicationCount} aplicaciones en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear aplicaciones desde los datos iniciales
    const results = await Promise.all(
      applicationInitialData.map(async (applicationData) => {
        return prisma.application
          .create({
            data: applicationData,
          })
          .then((application) => ({ success: true, application }))
          .catch((error) => {
            logger.error(
              `Error al crear aplicación ${applicationData.name}: ${error.message}`,
            );
            return { success: false, error, name: applicationData.name };
          });
      }),
    );

    // Contar resultados
    const successfulApplications = results.filter((r) => r.success) as Array<{
      success: true;
      application: any;
    }>;
    const failedApplications = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(
      `Se han creado ${successfulApplications.length} aplicaciones con éxito.`,
    );

    if (failedApplications.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedApplications.length} aplicaciones.`,
      );
      failedApplications.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar las aplicaciones creadas
    successfulApplications.forEach((result) => {
      if (result.application) {
        logger.log(
          `Aplicación creada: ${result.application.name} (${result.application.path})`,
        );
        logger.log(
          `  - Descripción: ${result.application.description?.substring(0, 50)}...`,
        );
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar aplicaciones: ${error.message}`);
    throw error;
  }
};
