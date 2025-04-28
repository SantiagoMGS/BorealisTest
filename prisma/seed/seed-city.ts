import { PrismaClient } from '@prisma/client';
import { cityInitialData } from './data';
import { Logger } from '@nestjs/common';

export const seedCities = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedCities');
  try {
    logger.log('Iniciando sembrado de ciudades...');

    // Verificar si ya existen ciudades para evitar duplicados
    const cityCount = await prisma.city.count();

    if (cityCount > 0) {
      logger.log(
        `Ya existen ${cityCount} ciudades en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear ciudades desde los datos iniciales
    const results = await Promise.all(
      cityInitialData.map(async (cityData) => {
        return prisma.city
          .create({
            data: cityData,
          })
          .then((city) => ({ success: true, city }))
          .catch((error) => {
            logger.error(
              `Error al crear ciudad ${cityData.name}: ${error.message}`,
            );
            return { success: false, error, name: cityData.name };
          });
      }),
    );

    // Contar resultados
    const successfulCities = results.filter((r) => r.success) as Array<{
      success: true;
      city: any;
    }>;
    const failedCities = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(`Se han creado ${successfulCities.length} ciudades con éxito.`);

    if (failedCities.length > 0) {
      logger.warn(`No se pudieron crear ${failedCities.length} ciudades.`);
      failedCities.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }
  } catch (error: any) {
    logger.error(`Error general al sembrar ciudades: ${error.message}`);
    throw error;
  }
};
