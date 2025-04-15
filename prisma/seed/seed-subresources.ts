import { PrismaClient } from '@prisma/client';
import { subresourceInitialData } from '../data/subresources.data';
import { batchTransactionTolerant } from '../utils/transaction.helper';

/**
 * Siembra los datos iniciales de subrecursos en la base de datos
 * @param prisma Instancia de PrismaClient configurada
 * @returns Array de subrecursos creados/actualizados
 */
export async function seedSubresources(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de subrecursos...');

  try {
    // Primero obtenemos todos los recursos para mapear nombres a IDs
    const resources = await prisma.resource.findMany();
    console.log('Recursos encontrados:', resources.map(r => r.name));
    
    const resourceMap = new Map(resources.map(r => [r.name, r.id]));

    // Completamos los datos de subrecursos con los IDs de recursos usando el campo resourceName
    const subresourcesWithResourceIds = subresourceInitialData.map(subresource => {
      const { resourceName, ...subresourceData } = subresource;
      
      // Buscamos el ID del recurso por nombre
      const resourceId = resourceMap.get(resourceName);
      
      if (!resourceId) {
        console.warn(`⚠️ No se encontró un recurso con nombre "${resourceName}" para el subrecurso "${subresource.name}"`);
        console.warn('Recursos disponibles:', Array.from(resourceMap.keys()).join(', '));
        // Usamos un ID por defecto para que no falle
        const firstResourceId = resources.length > 0 ? resources[0].id : '';
        return { ...subresourceData, resourceId: firstResourceId };
      }

      return { 
        ...subresourceData,
        resourceId 
      };
    });

    // Usamos batchTransactionTolerant para continuar incluso si algunos fallan
    return batchTransactionTolerant(
      prisma,
      subresourcesWithResourceIds,
      async (tx, subresourceData) => {
        // Verificamos que el resourceId esté definido
        if (!subresourceData.resourceId) {
          throw new Error(`El ID del recurso para "${subresourceData.name}" es inválido`);
        }

        // Verificamos si ya existe
        const existingSubresource = await tx.subresource.findFirst({
          where: {
            name: subresourceData.name,
            resourceId: subresourceData.resourceId,
          },
        });

        if (existingSubresource) {
          // Actualizamos el subrecurso existente
          return tx.subresource.update({
            where: { id: existingSubresource.id },
            data: {
              icon: subresourceData.icon,
              path: subresourceData.path
            },
          });
        } else {
          // Creamos un nuevo subrecurso
          return tx.subresource.create({
            data: subresourceData
          });
        }
      },
      {
        isolationLevel: 'ReadCommitted',
      }
    );
  } catch (error) {
    console.error('❌ Error en el seed de subrecursos:', error);
    return [];
  }
} 