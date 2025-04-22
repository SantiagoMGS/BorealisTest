import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { userCompanyInitialData } from './data';

export const seedUserCompanies = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedUserCompanies');
  try {
    logger.log('Iniciando sembrado de relaciones usuario-compañía...');

    // Verificar si ya existen relaciones para evitar duplicados
    const userCompanyCount = await prisma.userCompany.count();

    if (userCompanyCount > 0) {
      logger.log(
        `Ya existen ${userCompanyCount} relaciones usuario-compañía en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Obtener todos los usuarios, compañías y roles para mapearlos por nombre/email
    const users = await prisma.user.findMany();
    const companies = await prisma.company.findMany();
    const roles = await prisma.role.findMany();

    // Crear mapas para búsqueda rápida
    const usersMap = new Map(users.map((user) => [user.email, user.id]));
    const companiesMap = new Map(
      companies.map((company) => [company.name, company.id]),
    );
    const rolesMap = new Map(roles.map((role) => [role.name, role.id]));

    // Crear relaciones desde los datos iniciales
    const results = await Promise.all(
      userCompanyInitialData.map(async (relationData) => {
        try {
          const { userEmail, companyName, roleName } = relationData;

          // Buscar IDs correspondientes
          const userId = usersMap.get(userEmail);
          const companyId = companiesMap.get(companyName);
          const roleId = rolesMap.get(roleName);

          // Validar que existan todos los elementos
          if (!userId) {
            return {
              success: false,
              message: `Usuario no encontrado: ${userEmail}`,
              relationData,
            };
          }

          if (!companyId) {
            return {
              success: false,
              message: `Compañía no encontrada: ${companyName}`,
              relationData,
            };
          }

          if (!roleId) {
            return {
              success: false,
              message: `Rol no encontrado: ${roleName}`,
              relationData,
            };
          }

          // Crear la relación
          const userCompany = await prisma.userCompany.create({
            data: {
              userId,
              companyId,
              roleId,
              isActive: true,
            },
          });

          return {
            success: true,
            userCompany,
            relationData,
          };
        } catch (error: any) {
          return {
            success: false,
            message: error.message,
            relationData,
          };
        }
      }),
    );

    // Contar resultados
    const successfulRelations = results.filter((r) => r.success);
    const failedRelations = results.filter((r) => !r.success);

    logger.log(
      `Se han creado ${successfulRelations.length} relaciones usuario-compañía con éxito.`,
    );

    // Mostrar los éxitos
    successfulRelations.forEach((result: any) => {
      logger.log(
        `Relación creada: ${result.relationData.userEmail} - ${result.relationData.companyName} - ${result.relationData.roleName}`,
      );
    });

    // Mostrar los errores
    if (failedRelations.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedRelations.length} relaciones usuario-compañía.`,
      );
      failedRelations.forEach((result: any) => {
        logger.warn(
          `- Error: ${result.message} para ${result.relationData.userEmail} - ${result.relationData.companyName}`,
        );
      });
    }
  } catch (error: any) {
    logger.error(
      `Error general al sembrar relaciones usuario-compañía: ${error.message}`,
    );
    throw error;
  }
};
