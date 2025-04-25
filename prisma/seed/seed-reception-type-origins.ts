import { PrismaClient, ReceptionType, ReceptionOrigin } from '@prisma/client';
import { Logger } from '@nestjs/common';

type ReceptionTypeOriginRelation = {
  receptionTypeName: string;
  receptionOriginNames: string[];
};

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

    // Definir las relaciones entre tipos y orígenes de recepción
    const relationData: ReceptionTypeOriginRelation[] = [
      {
        receptionTypeName: 'Dore',
        receptionOriginNames: ['Aluvial', 'Subsistencia', 'Joyería'],
      },
      {
        receptionTypeName: 'Muestras',
        receptionOriginNames: ['Cola', 'Cabeza', 'Secado'],
      },
    ];

    // Crear las relaciones
    for (const relation of relationData) {
      // Obtener el ID del tipo de recepción
      const receptionType = await prisma.receptionType.findUnique({
        where: { name: relation.receptionTypeName },
      });

      if (!receptionType) {
        logger.warn(
          `Tipo de recepción '${relation.receptionTypeName}' no encontrado. Omitiendo relaciones.`,
        );
        continue;
      }

      // Procesar cada origen de recepción para este tipo
      for (const originName of relation.receptionOriginNames) {
        // Obtener el ID del origen de recepción
        const receptionOrigin = await prisma.receptionOrigin.findUnique({
          where: { name: originName },
        });

        if (!receptionOrigin) {
          logger.warn(
            `Origen de recepción '${originName}' no encontrado. Omitiendo relación.`,
          );
          continue;
        }

        // Crear la relación entre tipo y origen
        try {
          await prisma.receptionTypeOrigin.create({
            data: {
              receptionTypeId: receptionType.id,
              receptionOriginId: receptionOrigin.id,
            },
          });
          logger.log(
            `Relación creada: ${relation.receptionTypeName} - ${originName}`,
          );
        } catch (error: any) {
          logger.error(
            `Error al crear relación ${relation.receptionTypeName} - ${originName}: ${error.message}`,
          );
        }
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
