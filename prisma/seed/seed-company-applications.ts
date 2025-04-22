import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { companyApplicationInitialData } from './data/';

export const seedCompanyApplications = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedCompanyApplications');
  try {
    logger.log('Iniciando sembrado de relaciones compañía-aplicación...');

    // Verificar si ya existen relaciones para evitar duplicados
    const relationCount = await prisma.companyApplication.count();

    if (relationCount > 0) {
      logger.log(
        `Ya existen ${relationCount} relaciones compañía-aplicación en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Obtener todas las compañías y aplicaciones para relacionarlas
    const companies = await prisma.company.findMany();
    const applications = await prisma.application.findMany();

    const companiesMap = new Map(companies.map((comp) => [comp.name, comp.id]));
    const applicationsMap = new Map(
      applications.map((app) => [app.name, app.id]),
    );

    // Crear relaciones desde los datos iniciales
    for (const companyAppData of companyApplicationInitialData) {
      const companyId = companiesMap.get(companyAppData.companyName);

      if (!companyId) {
        logger.error(
          `No se encontró la compañía: ${companyAppData.companyName}`,
        );
        continue;
      }

      logger.log(`Procesando aplicaciones para: ${companyAppData.companyName}`);

      const results = await Promise.all(
        companyAppData.applicationNames.map(async (appName) => {
          try {
            const applicationId = applicationsMap.get(appName);

            if (!applicationId) {
              logger.warn(`No se encontró la aplicación: ${appName}`);
              return { success: false, appName, reason: 'not_found' };
            }

            // Crear la relación
            await prisma.companyApplication.create({
              data: {
                companyId,
                applicationId,
                isActive: true,
              },
            });

            return { success: true, appName };
          } catch (error: any) {
            logger.error(
              `Error al crear relación para ${appName}: ${error.message}`,
            );
            return { success: false, appName, error, reason: 'error' };
          }
        }),
      );

      // Mostrar resultados para esta compañía
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      logger.log(
        `  ✓ ${successCount} aplicaciones vinculadas a ${companyAppData.companyName}`,
      );
      if (failCount > 0) {
        logger.warn(`  ✗ ${failCount} aplicaciones fallaron al vincularse`);
        results
          .filter((r) => !r.success)
          .forEach((r) =>
            logger.warn(
              `    - ${r.appName} (${r.reason === 'not_found' ? 'No encontrada' : 'Error'})`,
            ),
          );
      }
    }

    // Mostrar resumen final
    const totalCount = await prisma.companyApplication.count();
    logger.log(
      `Sembrado completado. ${totalCount} relaciones compañía-aplicación creadas.`,
    );
  } catch (error: any) {
    logger.error(
      `Error general al sembrar relaciones compañía-aplicación: ${error.message}`,
    );
    throw error;
  }
};
