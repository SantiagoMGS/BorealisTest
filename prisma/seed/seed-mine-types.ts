import { PrismaClient } from '@prisma/client';
import { mineTypeInitialData } from './data/mine-types.data';
import { Logger } from '@nestjs/common';

export const seedMineTypes = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedMineTypes');
  try {
    logger.log('Iniciando sembrado de tipos de mina...');

    // Verificar si ya existen tipos de mina para evitar duplicados
    const mineTypeCount = await prisma.mineType.count();

    if (mineTypeCount > 0) {
      logger.log(
        `Ya existen ${mineTypeCount} tipos de mina en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear tipos de mina desde los datos iniciales
    const results = await Promise.all(
      mineTypeInitialData.map(async (mineTypeData) => {
        return prisma.mineType
          .create({
            data: mineTypeData,
          })
          .then((mineType) => ({ success: true, mineType }))
          .catch((error) => {
            logger.error(
              `Error al crear tipo de mina ${mineTypeData.name}: ${error.message}`,
            );
            return { success: false, error, name: mineTypeData.name };
          });
      }),
    );

    // Contar resultados
    const successfulMineTypes = results.filter((r) => r.success) as Array<{
      success: true;
      mineType: any;
    }>;
    const failedMineTypes = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(
      `Se han creado ${successfulMineTypes.length} tipos de mina con éxito.`,
    );

    if (failedMineTypes.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedMineTypes.length} tipos de mina.`,
      );
      failedMineTypes.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar los tipos de mina creados
    successfulMineTypes.forEach((result) => {
      if (result.mineType) {
        logger.log(
          `Tipo de mina creado: ${result.mineType.name} - Regalía: ${result.mineType.royalty_percentage}%`,
        );
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar tipos de mina: ${error.message}`);
    throw error;
  }
};
