import { PrismaClient, ReceptionType } from '@prisma/client';
import { receptionTypeInitialData } from './data/reception-types.data';
import { Logger } from '@nestjs/common';

type SuccessResult = {
  success: true;
  receptionType: ReceptionType;
};

type ErrorResult = {
  success: false;
  error: any;
  name: string;
};

type Result = SuccessResult | ErrorResult;

/**
 * Datos iniciales de tipos de recepción
 * Ej. Doré, Muestras, Mineral, Concentrado
 */
export const seedReceptionTypes = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedReceptionTypes');
  try {
    logger.log('Iniciando sembrado de tipos de recepción...');

    // Verificar si ya existen tipos de recepción para evitar duplicados
    const receptionTypeCount = await prisma.receptionType.count();

    if (receptionTypeCount > 0) {
      logger.log(
        `Ya existen ${receptionTypeCount} tipos de recepción en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear tipos de recepción desde los datos iniciales
    const results = await Promise.all(
      receptionTypeInitialData.map(async (receptionTypeData) => {
        return prisma.receptionType
          .create({
            data: receptionTypeData,
          })
          .then(
            (receptionType) =>
              ({ success: true, receptionType }) as SuccessResult,
          )
          .catch((error) => {
            logger.error(
              `Error al crear tipo de recepción ${receptionTypeData.name}: ${error.message}`,
            );
            return {
              success: false,
              error,
              name: receptionTypeData.name,
            } as ErrorResult;
          });
      }),
    );

    // Contar resultados
    const successfulTypes = results.filter(
      (r): r is SuccessResult => r.success,
    );
    const failedTypes = results.filter((r): r is ErrorResult => !r.success);

    logger.log(
      `Se han creado ${successfulTypes.length} tipos de recepción con éxito.`,
    );

    if (failedTypes.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedTypes.length} tipos de recepción.`,
      );
      failedTypes.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar los tipos de recepción creados
    successfulTypes.forEach((result) => {
      logger.log(
        `Tipo de recepción creado: ${result.receptionType.name} - ${result.receptionType.description}`,
      );
    });
  } catch (error: any) {
    logger.error(
      `Error general al sembrar tipos de recepción: ${error.message}`,
    );
    throw error;
  }
};
