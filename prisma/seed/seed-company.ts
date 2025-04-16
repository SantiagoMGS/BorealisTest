import { Prisma, PrismaClient } from '@prisma/client';
import { companyInitialData } from './data/companies.data';
import { Logger } from '@nestjs/common';

export const seedCompanies = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedCompanies');
  try {
    logger.log('Iniciando sembrado de compañías...');

    // Verificar si ya existen compañías para evitar duplicados
    const companyCount = await prisma.company.count();

    if (companyCount > 0) {
      logger.log(
        `Ya existen ${companyCount} compañías en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear compañías desde los datos iniciales
    const results = await Promise.all(
      companyInitialData.map(async (companyData) => {
        return prisma.company
          .create({
            data: companyData,
            include: {
              branding: true, // Incluir branding en el resultado
            },
          })
          .then((company) => ({ success: true, company }))
          .catch((error) => {
            logger.error(
              `Error al crear compañía ${companyData.name}: ${error.message}`,
            );
            return { success: false, error, name: companyData.name };
          });
      }),
    );

    // Contar resultados
    const successfulCompanies = results.filter((r) => r.success) as Array<{
      success: true;
      company: any;
    }>;
    const failedCompanies = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(
      `Se han creado ${successfulCompanies.length} compañías con éxito.`,
    );

    if (failedCompanies.length > 0) {
      logger.warn(`No se pudieron crear ${failedCompanies.length} compañías.`);
      failedCompanies.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar las compañías creadas
    successfulCompanies.forEach((result) => {
      if (result.company) {
        logger.log(
          `Compañía creada: ${result.company.name} (${result.company.shortName})`,
        );
        logger.log(
          `  - Con branding: ${result.company.branding ? 'Sí' : 'No'}`,
        );
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar compañías: ${error.message}`);
    throw error;
  }
};
