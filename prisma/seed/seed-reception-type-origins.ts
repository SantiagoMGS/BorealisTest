import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { receptionTypeOriginInitialData } from './data/reception-type-origin.data';

export const seedReceptionTypeOrigins = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedReceptionTypeOrigins');
  try {
    logger.log(
      'Iniciando sembrado de relaciones entre tipos y orígenes de recepción...',
    );

    // Verificar si ya existen relaciones para evitar duplicados
    const receptionTypeOriginCount = await prisma.receptionTypeOrigin.count();

    if (receptionTypeOriginCount > 0) {
      logger.log(
        `Ya existen ${receptionTypeOriginCount} relaciones de tipo-origen en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear las relaciones utilizando los datos iniciales
    for (const relationData of receptionTypeOriginInitialData) {
      const receptionTypeName =
        relationData.receptionType?.connect?.name || 'Desconocido';
      const receptionOriginName =
        relationData.receptionOrigin?.connect?.name || 'Desconocido';

      try {
        await prisma.receptionTypeOrigin.create({
          data: relationData,
        });
        logger.log(
          `Relación creada: ${receptionTypeName} - ${receptionOriginName}`,
        );
      } catch (error: any) {
        logger.error(
          `Error al crear relación ${receptionTypeName} - ${receptionOriginName}: ${error.message}`,
        );
      }
    }

    const finalCount = await prisma.receptionTypeOrigin.count();
    logger.log(
      `Se han creado ${finalCount} relaciones de tipo-origen con éxito.`,
    );
  } catch (error: any) {
    logger.error(
      `Error general al sembrar relaciones de tipo-origen: ${error.message}`,
    );
    throw error;
  }
};
