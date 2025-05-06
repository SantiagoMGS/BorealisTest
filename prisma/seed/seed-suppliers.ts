import { PrismaClient } from '@prisma/client';
import { supplierInitialData } from './data/suppliers.data';
import { Logger } from '@nestjs/common';

/**
 * Genera un shortName de 6 caracteres para un proveedor:
 * - 2 primeras letras del nombre del proveedor
 * - 4 últimos dígitos del número de documento
 */
function generateShortName(name: string, documentNumber: string): string {
  // Extraer las 2 primeras letras del nombre (convertidas a mayúsculas)
  // Si el nombre tiene menos de 2 letras, completar con 'X'
  const cleanName = name.replace(/[^a-zA-Z]/g, '');
  const namePrefix = cleanName.substring(0, 2).padEnd(2, 'X').toUpperCase();

  // Extraer los 4 últimos caracteres del documento
  // Si el documento tiene menos de 4 caracteres, completar con '0' al inicio
  const documentSuffix = documentNumber.slice(-4).padStart(4, '0');

  return namePrefix + documentSuffix;
}

export const seedSuppliers = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedSuppliers');
  try {
    logger.log('Iniciando sembrado de proveedores...');

    // Verificar si ya existen proveedores para evitar duplicados
    const supplierCount = await prisma.supplier.count();

    if (supplierCount > 0) {
      logger.log(
        `Ya existen ${supplierCount} proveedores en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear proveedores desde los datos iniciales, generando el shortName automáticamente
    const results = await Promise.all(
      supplierInitialData.map(async (supplierData) => {
        // Generar el shortName automáticamente según las reglas
        const shortName = generateShortName(
          supplierData.name,
          supplierData.documentNumber,
        );

        // Reemplazar el shortName original con el generado automáticamente
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

    // Contar resultados
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

    // Mostrar los proveedores creados
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
