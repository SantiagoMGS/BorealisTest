import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { supplierReceptionOriginInitialData } from './data';

export async function seedSupplierReceptionOrigins(prisma: PrismaClient) {
  const logger = new Logger('SeedSupplierReceptionOrigins');
  logger.log('Iniciando seedSupplierReceptionOrigins...');

  const count = await prisma.supplierReceptionOrigin.count();

  if (count > 0) {
    logger.log(
      'Las relaciones entre proveedores y orígenes ya existen. Omitiendo...',
    );
    return;
  }

  try {
    for (const item of supplierReceptionOriginInitialData) {
      const { supplierName, originName } = item;

      // Buscar el proveedor por nombre
      const supplier = await prisma.supplier.findFirst({
        where: { name: supplierName },
      });

      if (!supplier) {
        logger.warn(`Proveedor no encontrado: ${supplierName}`);
        continue;
      }

      // Buscar el origen por nombre
      const origin = await prisma.receptionOrigin.findFirst({
        where: { name: originName },
      });

      if (!origin) {
        logger.warn(`Origen no encontrado: ${originName}`);
        continue;
      }

      // Crear la relación
      await prisma.supplierReceptionOrigin.create({
        data: {
          supplierId: supplier.id,
          originId: origin.id,
        },
      });

      logger.log(`Relación creada: ${supplierName} - ${originName}`);
    }

    const finalCount = await prisma.supplierReceptionOrigin.count();
    logger.log(
      `✅ ${finalCount} relaciones entre proveedores y orígenes creadas.`,
    );
  } catch (error) {
    logger.error(`❌ Error durante el seedSupplierReceptionOrigins: ${error}`);
    throw error;
  }
}
