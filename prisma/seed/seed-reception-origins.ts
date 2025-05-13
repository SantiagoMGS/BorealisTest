import { PrismaClient, ReceptionOrigin } from '@prisma/client';
import { receptionOriginInitialData } from './data/reception-origins.data';
import { Logger } from '@nestjs/common';

type SuccessResult = {
  success: true;
  receptionOrigin: ReceptionOrigin;
};

type ErrorResult = {
  success: false;
  error: any;
  name: string;
};

type Result = SuccessResult | ErrorResult;

export const seedReceptionOrigins = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedReceptionOrigins');
  try {
    logger.log('Iniciando sembrado de orígenes de recepción...');

    const receptionOriginCount = await prisma.receptionOrigin.count();

    if (receptionOriginCount > 0) {
      logger.log(
        `Ya existen ${receptionOriginCount} orígenes de recepción en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    const results = await Promise.all(
      receptionOriginInitialData.map(async (receptionOriginData) => {
        return prisma.receptionOrigin
          .create({
            data: receptionOriginData,
          })
          .then(
            (receptionOrigin) =>
              ({ success: true, receptionOrigin }) as SuccessResult,
          )
          .catch((error) => {
            logger.error(
              `Error al crear origen de recepción ${receptionOriginData.name}: ${error.message}`,
            );
            return {
              success: false,
              error,
              name: receptionOriginData.name,
            } as ErrorResult;
          });
      }),
    );

    const successfulOrigins = results.filter(
      (r): r is SuccessResult => r.success,
    );
    const failedOrigins = results.filter((r): r is ErrorResult => !r.success);

    logger.log(
      `Se han creado ${successfulOrigins.length} orígenes de recepción con éxito.`,
    );

    if (failedOrigins.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedOrigins.length} orígenes de recepción.`,
      );
      failedOrigins.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    successfulOrigins.forEach((result) => {
      logger.log(
        `Origen de recepción creado: ${result.receptionOrigin.name} - ${result.receptionOrigin.description}`,
      );
    });
  } catch (error: any) {
    logger.error(
      `Error general al sembrar orígenes de recepción: ${error.message}`,
    );
    throw error;
  }
};
