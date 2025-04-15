import { PrismaClient } from '@prisma/client';
import { resourceInitialData } from '../data/resources.data';
import { batchTransaction } from '../utils/transaction.helper';

/**
 * Siembra los datos iniciales de recursos en la base de datos
 * @param prisma Instancia de PrismaClient configurada
 * @returns Array de recursos creados/actualizados
 */
export async function seedResources(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de recursos...');

  return batchTransaction(
    prisma,
    resourceInitialData,
    async (tx, resourceData) => {
      // Verificamos que el nombre del recurso sea válido
      if (!resourceData.name) {
        throw new Error('El nombre del recurso es requerido');
      }

      // Extraemos applicationName del objeto para que no se envíe a Prisma
      const { applicationName, ...resourceDataToSave } = resourceData;

      return tx.resource.upsert({
        where: { name: resourceData.name },
        update: {
          icon: resourceData.icon,
          path: resourceData.path,
        },
        create: resourceDataToSave,
      });
    },
    {
      isolationLevel: 'ReadCommitted',
    },
  );
}
