import { PrismaClient } from '@prisma/client';
import { resourceInitialData } from '../data/';
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

      return tx.resource.upsert({
        where: { name: resourceData.name },
        update: {
          icon: resourceData.icon,
        },
        create: resourceData,
      });
    },
    {
      isolationLevel: 'ReadCommitted',
    },
  );
} 