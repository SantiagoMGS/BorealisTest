import { PrismaClient } from '@prisma/client';
import { roleInitialData } from '../data/';
import { batchTransaction } from '../utils/transaction.helper';

/**
 * Siembra los datos iniciales de roles en la base de datos
 * @param prisma Instancia de PrismaClient configurada
 * @returns Array de roles creados/actualizados
 */
export async function seedRoles(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de roles...');

  return batchTransaction(
    prisma,
    roleInitialData,
    async (tx, roleData) => {
      return tx.role.upsert({
        where: { name: roleData.name },
        update: {
          description: roleData.description,
          isSystem: roleData.isSystem,
        },
        create: roleData,
      });
    },
    {
      isolationLevel: 'ReadCommitted',
    },
  );
}
