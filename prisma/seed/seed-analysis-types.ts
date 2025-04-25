import { PrismaClient } from '@prisma/client';
import { analysisTypeInitialData } from './data/';
import { Logger } from '@nestjs/common';

export const seedAnalysisTypes = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedAnalysisTypes');
  try {
    logger.log('Iniciando sembrado de tipos de análisis...');

    // Verificar si ya existen tipos de análisis para evitar duplicados
    const analysisTypeCount = await prisma.analysisType.count();

    if (analysisTypeCount > 0) {
      logger.log(
        `Ya existen ${analysisTypeCount} tipos de análisis en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear tipos de análisis desde los datos iniciales
    const results = await Promise.all(
      analysisTypeInitialData.map(async (analysisTypeData) => {
        const { requiredAmount, ...dataToCreate } = analysisTypeData;
        return prisma.analysisType
          .create({
            data: dataToCreate,
          })
          .then((analysisType) => ({ success: true, analysisType }))
          .catch((error) => {
            logger.error(
              `Error al crear tipo de análisis ${analysisTypeData.name}: ${error.message}`,
            );
            return { success: false, error, name: analysisTypeData.name };
          });
      }),
    );

    // Contar resultados
    const successfulAnalysisTypes = results.filter((r) => r.success) as Array<{
      success: true;
      analysisType: any;
    }>;
    const failedAnalysisTypes = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(
      `Se han creado ${successfulAnalysisTypes.length} tipos de análisis con éxito.`,
    );

    if (failedAnalysisTypes.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedAnalysisTypes.length} tipos de análisis.`,
      );
      failedAnalysisTypes.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar los tipos de análisis creados
    successfulAnalysisTypes.forEach((result) => {
      if (result.analysisType) {
        logger.log(
          `Tipo de análisis creado: ${result.analysisType.name} (${result.analysisType.shortName})`,
        );
        logger.log(`  - Descripción: ${result.analysisType.description}`);
      }
    });
  } catch (error: any) {
    logger.error(
      `Error general al sembrar tipos de análisis: ${error.message}`,
    );
    throw error;
  }
};
