import { PrismaClient } from '@prisma/client';
import { userInitialData } from '../data/';
import { batchTransaction } from '../utils/transaction.helper';

/**
 * Siembra los datos iniciales de usuarios en la base de datos
 * @param prisma Instancia de PrismaClient configurada
 * @returns Array de usuarios creados/actualizados
 */
export async function seedUsers(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de usuarios...');

  return batchTransaction(
    prisma,
    userInitialData,
    async (tx, userData) => {
      // Verificamos si el usuario ya existe
      const existingUser = await tx.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        // Actualizamos datos del usuario, pero no la contraseña
        return tx.user.update({
          where: { id: existingUser.id },
          data: {
            name: userData.name,
            isActive: userData.isActive,
          },
        });
      } else {
        // Creamos el usuario
        return tx.user.create({
          data: userData,
        });
      }
    },
    {
      isolationLevel: 'ReadCommitted',
    },
  );
} 