import { PrismaClient } from '@prisma/client';
import { getStatusData } from './data/status.data';
import { Logger } from '@nestjs/common';

export const seedStatus = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedStatus');
  try {
    logger.log('Iniciando sembrado de estados...');

    // Verificar si ya existen estados para evitar duplicados
    const statusCount = await prisma.status.count();

    if (statusCount > 0) {
      logger.log(
        `Ya existen ${statusCount} estados en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Obtener los datos de estados
    const statusData = getStatusData();

    // Crear estados desde los datos iniciales
    const results = await Promise.all(
      statusData.map(async (status) => {
        return prisma.status
          .create({
            data: status,
          })
          .then((createdStatus) => ({ success: true, status: createdStatus }))
          .catch((error) => {
            logger.error(
              `Error al crear estado ${status.name}: ${error.message}`,
            );
            return { success: false, error, name: status.name };
          });
      }),
    );

    // Contar resultados
    const successfulStatus = results.filter((r) => r.success) as Array<{
      success: true;
      status: any;
    }>;
    const failedStatus = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(`Se han creado ${successfulStatus.length} estados con éxito.`);

    if (failedStatus.length > 0) {
      logger.warn(`No se pudieron crear ${failedStatus.length} estados.`);
      failedStatus.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar los estados creados
    successfulStatus.forEach((result) => {
      if (result.status) {
        logger.log(`Estado creado: ${result.status.name}`);
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar estados: ${error.message}`);
    throw error;
  }
};
