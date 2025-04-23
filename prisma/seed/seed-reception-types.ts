import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { receptionTypeInitialData } from './data';

/**
 * Datos iniciales de tipos de recepción
 * Ej. Doré, Muestras, Mineral, Concentrado
 */
export async function seedReceptionTypes(prisma: PrismaClient): Promise<void> {
  const logger = new Logger('SeedReceptionTypes');

  logger.log('Iniciando sembrado de tipos de recepción...');

  try {
    // Verificar si ya existen registros
    const count = await prisma.receptionType.count();

    if (count > 0) {
      logger.log(`Ya existen ${count} tipos de recepción, omitiendo sembrado.`);
      return;
    }

    // Crear registros
    for (const receptionType of receptionTypeInitialData) {
      await prisma.receptionType.create({
        data: receptionType,
      });
    }

    logger.log(
      `✅ Sembrados ${receptionTypeInitialData.length} tipos de recepción con éxito`,
    );
  } catch (error: any) {
    logger.error(`❌ Error al sembrar tipos de recepción: ${error.message}`);
    throw error;
  }
}
