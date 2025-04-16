import { PrismaClient } from '@prisma/client';
import { actionInitialData } from './data/actions.data';
import { Logger } from '@nestjs/common';

export const seedActions = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedActions');
  try {
    logger.log('Iniciando sembrado de acciones...');

    // Verificar si ya existen acciones para evitar duplicados
    const actionCount = await prisma.action.count();

    if (actionCount > 0) {
      logger.log(
        `Ya existen ${actionCount} acciones en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear acciones desde los datos iniciales
    const results = await Promise.all(
      actionInitialData.map(async (actionData) => {
        return prisma.action
          .create({
            data: actionData,
          })
          .then((action) => ({ success: true, action }))
          .catch((error) => {
            logger.error(
              `Error al crear acción ${actionData.name}: ${error.message}`,
            );
            return { success: false, error, name: actionData.name };
          });
      }),
    );

    // Contar resultados
    const successfulActions = results.filter((r) => r.success) as Array<{
      success: true;
      action: any;
    }>;
    const failedActions = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(`Se han creado ${successfulActions.length} acciones con éxito.`);

    if (failedActions.length > 0) {
      logger.warn(`No se pudieron crear ${failedActions.length} acciones.`);
      failedActions.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar las acciones creadas
    successfulActions.forEach((result) => {
      if (result.action) {
        logger.log(
          `Acción creada: ${result.action.name} (Nivel: ${result.action.level})`,
        );
        logger.log(`  - Descripción: ${result.action.description}`);
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar acciones: ${error.message}`);
    throw error;
  }
};
