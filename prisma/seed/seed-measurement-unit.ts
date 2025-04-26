import { PrismaClient } from '@prisma/client';
import { measurementUnitInitialData } from './data/measurement-unit.data';
import { Logger } from '@nestjs/common';

export const seedMeasurementUnits = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedMeasurementUnits');
  try {
    logger.log('Iniciando sembrado de unidades de medida...');

    // Verificar si ya existen unidades de medida para evitar duplicados
    const measurementUnitCount = await prisma.measurementUnit.count();

    if (measurementUnitCount > 0) {
      logger.log(
        `Ya existen ${measurementUnitCount} unidades de medida en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear unidades de medida desde los datos iniciales
    const results = await Promise.all(
      measurementUnitInitialData.map(async (unitData) => {
        return prisma.measurementUnit
          .create({
            data: unitData,
          })
          .then((unit) => ({ success: true, unit }))
          .catch((error) => {
            logger.error(
              `Error al crear unidad de medida ${unitData.name}: ${error.message}`,
            );
            return { success: false, error, name: unitData.name };
          });
      }),
    );

    // Contar resultados
    const successfulUnits = results.filter((r) => r.success) as Array<{
      success: true;
      unit: any;
    }>;
    const failedUnits = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(
      `Se han creado ${successfulUnits.length} unidades de medida con éxito.`,
    );

    if (failedUnits.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedUnits.length} unidades de medida.`,
      );
      failedUnits.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar las unidades de medida creadas
    successfulUnits.forEach((result) => {
      if (result.unit) {
        logger.log(
          `Unidad de medida creada: ${result.unit.name} (${result.unit.shortName})`,
        );
      }
    });
  } catch (error: any) {
    logger.error(
      `Error general al sembrar unidades de medida: ${error.message}`,
    );
    throw error;
  }
};
