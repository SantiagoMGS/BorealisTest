import { Prisma, PrismaClient } from '@prisma/client';
import { userInitialData } from './data/users.data';
import { Logger } from '@nestjs/common';

export const seedUsers = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedUsers');
  try {
    logger.log('Iniciando sembrado de usuarios...');

    // Verificar si ya existen usuarios para evitar duplicados
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      logger.log(
        `Ya existen ${userCount} usuarios en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear usuarios desde los datos iniciales
    const results = await Promise.all(
      userInitialData.map(async (userData) => {
        return prisma.user
          .create({
            data: userData,
          })
          .then((user) => ({ success: true, user }))
          .catch((error) => {
            logger.error(
              `Error al crear usuario ${userData.email}: ${error.message}`,
            );
            return { success: false, error, email: userData.email };
          });
      }),
    );

    // Contar resultados
    const successfulUsers = results.filter((r) => r.success) as Array<{
      success: true;
      user: Prisma.UserCreateInput;
    }>;
    const failedUsers = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      email: string;
    }>;

    logger.log(`Se han creado ${successfulUsers.length} usuarios con éxito.`);

    if (failedUsers.length > 0) {
      logger.warn(`No se pudieron crear ${failedUsers.length} usuarios.`);
      failedUsers.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.email}`);
      });
    }

    // Mostrar los usuarios creados (sin contraseñas)
    successfulUsers.forEach((result) => {
      if (result.user) {
        const { hashedPassword, ...userInfo } = result.user;
        logger.log(`Usuario creado: ${userInfo.email} - ${userInfo.name}`);
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar usuarios: ${error.message}`);
    throw error;
  }
};
