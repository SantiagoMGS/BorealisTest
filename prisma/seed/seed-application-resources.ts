import { PrismaClient } from '@prisma/client';
import { applicationResourceInitialData } from '../data/';

type ApplicationResourceRelation = {
  applicationId: string;
  resourceId: string;
  isActive: boolean;
};

/**
 * Siembra los datos iniciales de relaciones entre aplicaciones y recursos
 * @param prisma Instancia de PrismaClient configurada
 * @returns Array de relaciones creadas/actualizadas
 */
export async function seedApplicationResources(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de relaciones aplicación-recurso...');

  try {
    // Obtenemos las aplicaciones y recursos existentes
    const applications = await prisma.application.findMany();
    const resources = await prisma.resource.findMany();

    // Mapeamos nombres a IDs para facilitar la búsqueda
    const applicationMap = new Map(applications.map(a => [a.name, a.id]));
    const resourceMap = new Map(resources.map(r => [r.name, r.id]));

    // Recopilamos todas las relaciones a crear
    const applicationResources: ApplicationResourceRelation[] = [];

    for (const appResource of applicationResourceInitialData) {
      const applicationId = applicationMap.get(appResource.applicationName);
      if (!applicationId) {
        console.warn(`⚠️ No se encontró la aplicación: ${appResource.applicationName}`);
        continue;
      }

      for (const resourceName of appResource.resourceNames) {
        const resourceId = resourceMap.get(resourceName);
        if (!resourceId) {
          console.warn(`⚠️ No se encontró el recurso: ${resourceName}`);
          continue;
        }

        applicationResources.push({
          applicationId,
          resourceId,
          isActive: true,
        });
      }
    }

    // Procesamos cada relación una por una para evitar problemas con transacciones
    const results: ApplicationResourceRelation[] = [];
    
    for (const relation of applicationResources) {
      try {
        // Creamos directamente la relación sin verificar si existe
        // La clave primaria compuesta debería manejar la unicidad
        try {
          await prisma.$executeRaw`
            INSERT INTO application_resources 
              ("applicationId", "resourceId", "isActive", "createdAt", "updatedAt") 
            VALUES 
              (${relation.applicationId}::uuid, ${relation.resourceId}::uuid, ${relation.isActive}, NOW(), NOW())
            ON CONFLICT ("applicationId", "resourceId") 
            DO UPDATE SET 
              "isActive" = ${relation.isActive},
              "updatedAt" = NOW()
          `;
          console.log(`✅ Relación procesada: App ${relation.applicationId.substring(0, 8)} - Recurso ${relation.resourceId.substring(0, 8)}`);
          results.push(relation);
        } catch (error) {
          console.error(`❌ Error al insertar relación: App ${relation.applicationId.substring(0, 8)} - Recurso ${relation.resourceId.substring(0, 8)}`, error);
        }
      } catch (error) {
        console.error(`❌ Error al procesar relación: App ${relation.applicationId.substring(0, 8)} - Recurso ${relation.resourceId.substring(0, 8)}`, error);
      }
    }

    return results;
  } catch (error) {
    console.error('❌ Error en el seed de relaciones aplicación-recurso:', error);
    return [];
  }
} 