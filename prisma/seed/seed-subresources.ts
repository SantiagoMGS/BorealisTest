import { PrismaClient } from '@prisma/client';
import { subresourceInitialData } from '../data/';
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
    const resourceMap = new Map(resources.map(r => [r.name, r.id]));

    // Completamos los datos de subrecursos con los IDs de recursos
    const subresourcesWithResourceIds = subresourceInitialData.map(subresource => {
      // Extraemos el nombre del recurso del nombre del subrecurso
      // Por ejemplo, "Gestión de usuarios" pertenece al recurso "Usuarios"
      const resourceName = resources.find(resource => 
        subresource.name.toLowerCase().includes(resource.name.toLowerCase()) || 
        (subresource.name === 'Permisos' && resource.name === 'Roles') || // Caso especial
        (subresource.name === 'Resultados' && resource.name === 'Muestras') // Caso especial
      )?.name;

      if (!resourceName || !resourceMap.has(resourceName)) {
        console.warn(`⚠️ No se encontró un recurso para el subrecurso "${subresource.name}"`);
        // Usamos un ID por defecto para que no falle
        const defaultResourceId = resourceMap.get('Dashboard') || '';
        return { ...subresource, resourceId: defaultResourceId };
      }

      return { 
        ...subresource,
        resourceId: resourceMap.get(resourceName) || '' // Aseguramos que no sea undefined
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
            },
          });
        } else {
          // Creamos un nuevo subrecurso
          return tx.subresource.create({
            data: {
              name: subresourceData.name,
              resourceId: subresourceData.resourceId,
              icon: subresourceData.icon,
            },
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