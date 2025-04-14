import { PrismaClient } from '@prisma/client';
import { companyApplicationInitialData } from '../data/';
import { batchTransactionTolerant } from '../utils/transaction.helper';

type CompanyApplicationRelation = {
  companyId: string;
  applicationId: string;
  isActive: boolean;
};

/**
 * Siembra los datos iniciales de relaciones entre compañías y aplicaciones
 * @param prisma Instancia de PrismaClient configurada
 * @returns Array de relaciones creadas/actualizadas
 */
export async function seedCompanyApplications(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de relaciones compañía-aplicación...');

  try {
    // Obtenemos las compañías y aplicaciones existentes
    const companies = await prisma.company.findMany();
    const applications = await prisma.application.findMany();

    // Mapeamos nombres a IDs para facilitar la búsqueda
    const companyMap = new Map(companies.map(c => [c.name, c.id]));
    const applicationMap = new Map(applications.map(a => [a.name, a.id]));

    // Recopilamos todas las relaciones a crear
    const companyApplications: CompanyApplicationRelation[] = [];

    for (const companyApp of companyApplicationInitialData) {
      const companyId = companyMap.get(companyApp.companyName);
      if (!companyId) {
        console.warn(`⚠️ No se encontró la compañía: ${companyApp.companyName}`);
        continue;
      }

      for (const appName of companyApp.applicationNames) {
        const applicationId = applicationMap.get(appName);
        if (!applicationId) {
          console.warn(`⚠️ No se encontró la aplicación: ${appName}`);
          continue;
        }

        companyApplications.push({
          companyId,
          applicationId,
          isActive: true,
        });
      }
    }

    // Usamos batchTransactionTolerant para continuar si alguno falla
    return batchTransactionTolerant(
      prisma,
      companyApplications,
      async (tx, relation) => {
        // Verificamos si ya existe la relación
        const existingRelation = await tx.companyApplication.findUnique({
          where: {
            companyId_applicationId: {
              companyId: relation.companyId,
              applicationId: relation.applicationId,
            },
          },
        });

        if (existingRelation) {
          // Actualizamos la relación existente
          return tx.companyApplication.update({
            where: {
              companyId_applicationId: {
                companyId: relation.companyId,
                applicationId: relation.applicationId,
              },
            },
            data: {
              isActive: relation.isActive,
            },
          });
        } else {
          // Creamos la relación
          return tx.companyApplication.create({
            data: relation,
          });
        }
      },
      {
        isolationLevel: 'ReadCommitted',
      }
    );
  } catch (error) {
    console.error('❌ Error en el seed de relaciones compañía-aplicación:', error);
    return [];
  }
} 