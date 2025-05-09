import { PrismaClient, Prisma } from '@prisma/client';
import { analysisTypeInitialData } from './data/';
import { Logger } from '@nestjs/common';

const logger = new Logger('SeedAnalysisTypes');

async function createAnalysisType(
  prisma: PrismaClient,
  analysisTypeData: (typeof analysisTypeInitialData)[0],
) {
  const { analysisResult, ...rest } = analysisTypeData;

  try {
    const analysisType = await prisma.analysisType.create({
      data: {
        ...rest,
        analysisResult: analysisResult ?? Prisma.JsonNull,
      },
    });

    logger.log(
      `Tipo de análisis creado: ${analysisType.name} (${analysisType.shortName})`,
    );
    logger.log(`  - Descripción: ${analysisType.description}`);

    return { success: true, analysisType };
  } catch (error: any) {
    logger.error(
      `Error al crear tipo de análisis ${analysisTypeData.name}: ${error.message}`,
    );
    return { success: false, error, name: analysisTypeData.name };
  }
}

export const seedAnalysisTypes = async (prisma: PrismaClient) => {
  try {
    logger.log('Iniciando sembrado de tipos de análisis...');

    const analysisTypeCount = await prisma.analysisType.count();
    if (analysisTypeCount > 0) {
      logger.log(
        `Ya existen ${analysisTypeCount} tipos de análisis en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    const results = await Promise.all(
      analysisTypeInitialData.map((data) => createAnalysisType(prisma, data)),
    );

    const successfulAnalysisTypes = results.filter(
      (r): r is { success: true; analysisType: any } => r.success,
    );
    const failedAnalysisTypes = results.filter(
      (r): r is { success: false; error: any; name: string } => !r.success,
    );

    logger.log(
      `Se han creado ${successfulAnalysisTypes.length} tipos de análisis con éxito.`,
    );

    if (failedAnalysisTypes.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedAnalysisTypes.length} tipos de análisis:`,
      );
      failedAnalysisTypes.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }
  } catch (error: any) {
    logger.error(
      `Error general al sembrar tipos de análisis: ${error.message}`,
    );
    throw error;
  }
};
