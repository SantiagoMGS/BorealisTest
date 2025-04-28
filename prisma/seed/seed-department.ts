import { PrismaClient } from '@prisma/client';
import { departmentInitialData } from './data';
import { Logger } from '@nestjs/common';

export const seedDepartments = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedDepartments');
  try {
    logger.log('Iniciando sembrado de departamentos...');

    // Verificar si ya existen departamentos para evitar duplicados
    const departmentCount = await prisma.department.count();

    if (departmentCount > 0) {
      logger.log(
        `Ya existen ${departmentCount} departamentos en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear departamentos desde los datos iniciales
    const results = await Promise.all(
      departmentInitialData.map(async (departmentData) => {
        return prisma.department
          .create({
            data: departmentData,
          })
          .then((department) => ({ success: true, department }))
          .catch((error) => {
            logger.error(
              `Error al crear departamento ${departmentData.name}: ${error.message}`,
            );
            return { success: false, error, name: departmentData.name };
          });
      }),
    );

    // Contar resultados
    const successfulDepartments = results.filter((r) => r.success) as Array<{
      success: true;
      department: any;
    }>;
    const failedDepartments = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(
      `Se han creado ${successfulDepartments.length} departamentos con éxito.`,
    );

    if (failedDepartments.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedDepartments.length} departamentos.`,
      );
      failedDepartments.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar los departamentos creados
    successfulDepartments.forEach((result) => {
      if (result.department) {
        logger.log(`Departamento creado: ${result.department.name}`);
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar departamentos: ${error.message}`);
    throw error;
  }
};
