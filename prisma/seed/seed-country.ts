import { PrismaClient } from '@prisma/client';
import { countryInitialData } from './data';
import { Logger } from '@nestjs/common';

export const seedCountries = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedCountries');
  try {
    logger.log('Iniciando sembrado de países...');

    // Verificar si ya existen países para evitar duplicados
    const countryCount = await prisma.country.count();

    if (countryCount > 0) {
      logger.log(
        `Ya existen ${countryCount} países en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    const results = await Promise.all(
      countryInitialData.map(async (countryData) => {
        return prisma.country
          .create({
            data: countryData,
          })
          .then((country) => ({ success: true, country }))
          .catch((error) => {
            logger.error(
              `Error al crear país ${countryData.name}: ${error.message}`,
            );
            return { success: false, error, name: countryData.name };
          });
      }),
    );

    // Contar resultados
    const successfulCountries = results.filter((r) => r.success) as Array<{
      success: true;
      country: any;
    }>;
    const failedCountries = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(`Se han creado ${successfulCountries.length} países con éxito.`);

    if (failedCountries.length > 0) {
      logger.warn(`No se pudieron crear ${failedCountries.length} países.`);
      failedCountries.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar los países creados
    successfulCountries.forEach((result) => {
      if (result.country) {
        logger.log(`País creado: ${result.country.name}`);
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar países: ${error.message}`);
    throw error;
  }
};
