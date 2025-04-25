import { Prisma, PrismaClient } from '@prisma/client';
import { companySupplierInitialData } from './data';
import { Logger } from '@nestjs/common';

export const seedCompanySuppliers = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedCompanySupppliers');
  const startTime = Date.now();
  logger.log(
    'Iniciando siembra de relaciones entre compañías y proveedores...',
  );

  try {
    // Transformar los datos a formato Prisma CreateInput
    const companySupplierData = await Promise.all(
      companySupplierInitialData.map(async ({ companyName, supplierName }) => {
        const company = await prisma.company.findUnique({
          where: { name: companyName },
        });

        // Primero intentamos obtener todos los proveedores con ese nombre
        const suppliers = await prisma.supplier.findMany({
          where: { name: supplierName },
        });

        if (!suppliers || suppliers.length === 0) {
          throw new Error(`No se encontró el proveedor ${supplierName}`);
        }

        // Usamos el primer proveedor encontrado
        const supplier = suppliers[0];

        if (!company) {
          throw new Error(`No se encontró la compañía ${companyName}`);
        }

        return {
          company: {
            connect: { id: company.id },
          },
          supplier: {
            connect: { id: supplier.id },
          },
        };
      }),
    );

    // Crear todos los registros de CompanySupplier
    for (const data of companySupplierData) {
      await prisma.companySupplier.create({
        data,
      });
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    logger.log(
      `✅ Siembra de relaciones entre compañías y proveedores completada (${duration}s)`,
    );
    logger.log(
      `   Se crearon ${companySupplierData.length} registros de relaciones`,
    );
  } catch (error) {
    logger.error(
      '❌ Error al sembrar las relaciones entre compañías y proveedores:',
    );
    logger.error(error);
    throw error;
  }
};
