import { PrismaClient } from '@prisma/client';
import { batchTransaction } from '@prisma/utils/transaction.helper';
import { actionInitialData } from '../data/';

export async function seedActions(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de acciones...');

  return batchTransaction(
    prisma,
    actionInitialData,
    async (tx, actionData) => {
      return tx.action.upsert({
        where: { name: actionData.name },
        update: {
          level: actionData.level,
          description: actionData.description,
        },
        create: actionData,
      });
    },
    {
      // Nivel de aislamiento más ligero para mejor rendimiento
      isolationLevel: 'ReadCommitted',
    },
  );
}
