import { PrismaClient } from '@prisma/client';
import { supplierMiningTitleInitialData } from './data/supplier-mining-titles.data';
import { Logger } from '@nestjs/common';

export const seedSupplierMiningTitles = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedSupplierMiningTitles');
  try {
    logger.log('Iniciando sembrado de títulos mineros...');

    // Verificar si ya existen títulos mineros para evitar duplicados
    const titleCount = await prisma.supplierMiningTitle.count();

    if (titleCount > 0) {
      logger.log(
        `Ya existen ${titleCount} títulos mineros en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear títulos mineros desde los datos iniciales
    const results = await Promise.all(
      supplierMiningTitleInitialData.map(async (titleData) => {
        try {
          // Obtener el ID del proveedor
          const supplier = await prisma.supplier.findFirst({
            where: {
              name: titleData.supplier.connect.name,
            },
          });

          if (!supplier) {
            return {
              success: false,
              error: `Proveedor no encontrado: ${titleData.supplier.connect.name}`,
              name: titleData.name,
            };
          }

          // Obtener el ID del tipo de mina
          const mineType = await prisma.mineType.findFirst({
            where: {
              name: titleData.mineType.connect.name,
            },
          });

          if (!mineType) {
            return {
              success: false,
              error: `Tipo de mina no encontrado: ${titleData.mineType.connect.name}`,
              name: titleData.name,
            };
          }

          // Obtener el ID de la ciudad
          const city = await prisma.city.findFirst({
            where: {
              name: titleData.city.connect.name,
              daneCode: titleData.city.connect.daneCode,
              department: {
                name: titleData.city.connect.department.name,
              },
            },
          });

          if (!city) {
            return {
              success: false,
              error: `Ciudad no encontrada: ${titleData.city.connect.name}, ${titleData.city.connect.department.name}`,
              name: titleData.name,
            };
          }

          // Crear el título minero
          const title = await prisma.supplierMiningTitle.create({
            data: {
              name: titleData.name,
              isActive: titleData.isActive,
              supplier: {
                connect: { id: supplier.id },
              },
              mineType: {
                connect: { id: mineType.id },
              },
              city: {
                connect: { id: city.id },
              },
            },
          });

          return {
            success: true,
            title,
            name: titleData.name,
          };
        } catch (error: any) {
          logger.error(
            `Error al crear título minero ${titleData.name}: ${error.message}`,
          );
          return {
            success: false,
            error: error.message,
            name: titleData.name,
          };
        }
      }),
    );

    // Contar resultados
    const successfulTitles = results.filter((r) => r.success) as Array<{
      success: true;
      title: any;
      name: string;
    }>;

    const failedTitles = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(
      `Se han creado ${successfulTitles.length} títulos mineros con éxito.`,
    );

    if (failedTitles.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedTitles.length} títulos mineros.`,
      );
      failedTitles.forEach((result) => {
        logger.warn(
          `- Falló al crear: ${result.name} - Error: ${result.error}`,
        );
      });
    }

    // Mostrar los títulos mineros creados
    successfulTitles.forEach((result) => {
      if (result.title) {
        logger.log(`Título minero creado: ${result.name}`);
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar títulos mineros: ${error.message}`);
    throw error;
  }
};
