import { PrismaClient } from '@prisma/client';
import { batchTransactionTolerant } from '../utils/transaction.helper';

type UserCompanyRelation = {
  userId: string;
  companyId: string;
  roleId: string;
  isActive: boolean;
};

/**
 * Siembra los datos iniciales de relaciones entre usuarios y compañías
 * @param prisma Instancia de PrismaClient configurada
 * @returns Array de relaciones creadas/actualizadas
 */
export async function seedUserCompanies(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de relaciones usuario-compañía...');

  try {
    // Obtenemos los usuarios, roles y compañías existentes
    const users = await prisma.user.findMany();
    const companies = await prisma.company.findMany();
    const roles = await prisma.role.findMany();

    // Mapeamos nombres a IDs para facilitar la búsqueda
    const userMap = new Map(users.map(u => [u.email, u.id]));
    const companyMap = new Map(companies.map(c => [c.name, c.id]));
    const roleMap = new Map(roles.map(r => [r.name, r.id]));

    // Relaciones a crear
    const userCompanyRelations = [
      // Admin en QUINTANA como SUPERADMIN
      {
        userEmail: 'admin@borealis-security.com',
        companyName: 'QUINTANA',
        roleName: 'SUPERADMIN',
      },
      // Admin en MONA MINAS como ADMIN
      {
        userEmail: 'admin@borealis-security.com',
        companyName: 'MONA MINAS',
        roleName: 'ADMIN',
      },
      // Técnico en QUINTANA como TECNICO
      {
        userEmail: 'tecnico@borealis-security.com',
        companyName: 'QUINTANA',
        roleName: 'TECNICO',
      },
      // Auxiliar en COLOMBIAN MINT como AUXILIAR
      {
        userEmail: 'auxiliar@borealis-security.com',
        companyName: 'COLOMBIAN MINT',
        roleName: 'AUXILIAR',
      },
    ];

    // Transformamos a relaciones con IDs
    const userCompanyData: UserCompanyRelation[] = [];
    
    for (const relation of userCompanyRelations) {
      const userId = userMap.get(relation.userEmail);
      const companyId = companyMap.get(relation.companyName);
      const roleId = roleMap.get(relation.roleName);

      if (!userId || !companyId || !roleId) {
        console.warn(`⚠️ No se pudo mapear la relación: ${relation.userEmail} - ${relation.companyName} - ${relation.roleName}`);
        continue;
      }

      userCompanyData.push({
        userId,
        companyId,
        roleId,
        isActive: true,
      });
    }

    // Usamos batchTransactionTolerant para continuar si alguno falla
    return batchTransactionTolerant(
      prisma,
      userCompanyData,
      async (tx, relation) => {
        // Verificamos si ya existe la relación
        const existingRelation = await tx.userCompany.findUnique({
          where: {
            userId_companyId_roleId: {
              userId: relation.userId,
              companyId: relation.companyId,
              roleId: relation.roleId,
            },
          },
        });

        if (existingRelation) {
          // Actualizamos la relación existente
          return tx.userCompany.update({
            where: {
              userId_companyId_roleId: {
                userId: relation.userId,
                companyId: relation.companyId,
                roleId: relation.roleId,
              },
            },
            data: {
              isActive: relation.isActive,
            },
          });
        } else {
          // Creamos la relación
          return tx.userCompany.create({
            data: relation,
          });
        }
      },
      {
        isolationLevel: 'ReadCommitted',
      }
    );
  } catch (error) {
    console.error('❌ Error en el seed de relaciones usuario-compañía:', error);
    return [];
  }
} 