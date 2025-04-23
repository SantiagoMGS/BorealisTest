import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { receptionOriginInitialData } from './data';

/**
 * Datos iniciales de orígenes de recepción
 * Ej. Cabeza, Cola, Secado, Aluvial, Joyería, Subsistencia, etc.
 */
export async function seedReceptionOrigins(
  prisma: PrismaClient,
): Promise<void> {
  const logger = new Logger('SeedReceptionOrigins');

  logger.log('Iniciando sembrado de orígenes de recepción...');

  try {
    // Verificar si ya existen registros
    const count = await prisma.receptionOrigin.count();

    if (count > 0) {
      logger.log(
        `Ya existen ${count} orígenes de recepción, omitiendo sembrado.`,
      );
      return;
    }

    // Crear registros
    for (const receptionOrigin of receptionOriginInitialData) {
      await prisma.receptionOrigin.create({
        data: receptionOrigin,
      });
    }

    logger.log(
      `✅ Sembrados ${receptionOriginInitialData.length} orígenes de recepción con éxito`,
    );
  } catch (error: any) {
    logger.error(`❌ Error al sembrar orígenes de recepción: ${error.message}`);
    throw error;
  }
}
