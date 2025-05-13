import { PrismaClient } from '@prisma/client';
import { supplierInitialData } from './data/suppliers.data';
import { Logger } from '@nestjs/common';

function generateShortName(name: string, documentNumber: string): string {
  const cleanName = name.replace(/[^a-zA-Z]/g, '');
  const namePrefix = cleanName.substring(0, 2).padEnd(2, 'X').toUpperCase();

  const documentSuffix = documentNumber.slice(-4).padStart(4, '0');

  return namePrefix + documentSuffix;
}

export const seedSuppliers = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedSuppliers');
  try {
    logger.log('Iniciando sembrado de proveedores...');

    const supplierCount = await prisma.supplier.count();

    if (supplierCount > 0) {
      logger.log(
        `Ya existen ${supplierCount} proveedores en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    const results = await Promise.all(
      supplierInitialData.map(async (supplierData) => {
        const shortName = generateShortName(
          supplierData.name,
          supplierData.documentNumber,
        );

        return prisma.supplier
          .create({
            data: {
              ...supplierData,
              shortName,
            },
          })
          .then((supplier) => ({ success: true, supplier }))
          .catch((error) => {
            logger.error(
              `Error al crear proveedor ${supplierData.name}: ${error.message}`,
            );
            return { success: false, error, name: supplierData.name };
          });
      }),
    );

    const successfulSuppliers = results.filter((r) => r.success) as Array<{
      success: true;
      supplier: any;
    }>;
    const failedSuppliers = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(
      `Se han creado ${successfulSuppliers.length} proveedores con éxito.`,
    );

    if (failedSuppliers.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedSuppliers.length} proveedores.`,
      );
      failedSuppliers.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    successfulSuppliers.forEach((result) => {
      if (result.supplier) {
        logger.log(
          `Proveedor creado: ${result.supplier.name} - Documento: ${result.supplier.documentNumber})`,
        );
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar proveedores: ${error.message}`);
    throw error;
  }
};
