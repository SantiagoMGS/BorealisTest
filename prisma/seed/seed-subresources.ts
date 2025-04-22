import { PrismaClient } from '@prisma/client';
import { subresourceInitialData } from './data/';
import { Logger } from '@nestjs/common';

export const seedSubresources = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedSubresources');
  try {
    logger.log('Iniciando sembrado de subrecursos...');

    // Verificar si ya existen subrecursos para evitar duplicados
    const subresourceCount = await prisma.subresource.count();

    if (subresourceCount > 0) {
      logger.log(
        `Ya existen ${subresourceCount} subrecursos en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Obtener todos los recursos para asociarlos
    const resources = await prisma.resource.findMany();
    const resourcesMap = new Map(resources.map((res) => [res.name, res.id]));

    // Crear subrecursos desde los datos iniciales
    const results = await Promise.all(
      subresourceInitialData.map(async (subresourceData) => {
        // Obtener el ID del recurso padre por nombre
        const resourceId = resourcesMap.get(subresourceData.resourceName);

        if (!resourceId) {
          logger.error(
            `No se encontró el recurso padre: ${subresourceData.resourceName}`,
          );
          return {
            success: false,
            name: subresourceData.name,
            resourceName: subresourceData.resourceName,
            reason: 'parent_not_found',
          };
        }

        try {
          // Extraer el nombre del recurso y agregar el ID real
          const { resourceName, ...createData } = subresourceData;
          createData.resourceId = resourceId;

          // Crear el subrecurso
          const subresource = await prisma.subresource.create({
            data: createData,
          });

          return {
            success: true,
            subresource,
            resourceName,
          };
        } catch (error: any) {
          logger.error(
            `Error al crear subrecurso ${subresourceData.name} para ${subresourceData.resourceName}: ${error.message}`,
          );
          return {
            success: false,
            error,
            name: subresourceData.name,
            resourceName: subresourceData.resourceName,
            reason: 'error',
          };
        }
      }),
    );

    // Contar resultados
    const successfulSubresources = results.filter((r) => r.success) as Array<{
      success: true;
      subresource: any;
      resourceName: string;
    }>;

    const failedSubresources = results.filter((r) => !r.success) as Array<{
      success: false;
      name: string;
      resourceName: string;
      reason: string;
      error?: any;
    }>;

    logger.log(
      `Se han creado ${successfulSubresources.length} subrecursos con éxito.`,
    );

    if (failedSubresources.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedSubresources.length} subrecursos.`,
      );
      failedSubresources.forEach((result) => {
        logger.warn(
          `- Falló al crear: ${result.name} (${result.resourceName}) - Razón: ${result.reason}`,
        );
      });
    }

    // Agrupar subrecursos por recurso padre
    const subresourcesByResource = new Map<string, number>();

    successfulSubresources.forEach((result) => {
      const resourceName = result.resourceName;
      subresourcesByResource.set(
        resourceName,
        (subresourcesByResource.get(resourceName) || 0) + 1,
      );

      logger.log(
        `Subrecurso creado: ${result.subresource.name} (${result.subresource.path})`,
      );
      logger.log(`  - Recurso padre: ${resourceName}`);
    });

    // Resumen por recurso
    logger.log('Resumen de subrecursos creados por recurso:');
    subresourcesByResource.forEach((count, resourceName) => {
      logger.log(`  - ${resourceName}: ${count} subrecursos`);
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar subrecursos: ${error.message}`);
    throw error;
  }
};
