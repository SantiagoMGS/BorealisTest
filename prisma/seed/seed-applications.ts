import { PrismaClient } from '@prisma/client';
import { batchTransaction } from '@prisma/utils/transaction.helper';
import { applicationInitialData } from '../data/';

// Optimización de seeds para aplicaciones
export async function seedApplications(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de aplicaciones...');

  return batchTransaction(
    prisma,
    applicationInitialData,
    async (tx, appData) => {
      return tx.application.upsert({
        where: { name: appData.name },
        update: {
          description: appData.description,
          logo: appData.logo,
        },
        create: appData,
      });
    },
    {
      // Nivel de aislamiento más ligero para mejor rendimiento
      isolationLevel: 'ReadCommitted',
    },
  );
}
