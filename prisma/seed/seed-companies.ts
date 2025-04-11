// prisma/seed/seed-companies.ts (versión mejorada)
import { Prisma, PrismaClient } from '@prisma/client';
import { companyInitialData } from '../data/companies.data';
import { batchTransactionTolerant } from '../utils/transaction.helper';

/**
 * Siembra los datos iniciales de compañías en la base de datos
 * Incluye validaciones y manejo seguro de relaciones anidadas
 * Permite continuar cuando un item falla (no revierte toda la transacción)
 *
 * @param prisma Instancia de PrismaClient configurada
 * @returns Array de compañías creadas/actualizadas
 */
export async function seedCompanies(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de compañías...');

  try {
    // Usamos la función batchTransactionTolerant para procesar los datos
    // Esta función permite continuar cuando un item falla sin revertir todo
    const results = await batchTransactionTolerant(
      prisma,
      companyInitialData,
      async (tx, companyData, index) => {
        // Validamos que los datos de entrada tengan la estructura esperada
        if (!companyData.name || !companyData.shortName) {
          throw new Error(`Datos de compañía incompletos: se requiere name y shortName`);
        }

        // Verificamos si ya existe una compañía con el mismo shortName (diferente a la actual)
        const existingShortName = await tx.company.findFirst({
          where: { 
            shortName: companyData.shortName,
            name: { not: companyData.name } // Excluimos la propia compañía
          },
        });

        if (existingShortName) {
          throw new Error(`El shortName "${companyData.shortName}" ya está asignado a la compañía "${existingShortName.name}"`);
        }

        // Extraemos los datos de branding de forma segura
        const brandingData =
          companyData.branding && 'create' in companyData.branding
            ? companyData.branding.create
            : null;

        // Verificamos si la compañía ya existe
        const existingCompany = await tx.company.findUnique({
          where: { name: companyData.name },
          include: { branding: true },
        });

        if (existingCompany) {
          // Preparamos los datos de actualización
          const updateData: Prisma.CompanyUpdateInput = {
            shortName: companyData.shortName,
          };

          // Solo incluimos la actualización de branding si tenemos datos para ello
          if (brandingData) {
            updateData.branding = existingCompany.branding
              ? { update: brandingData }
              : { create: brandingData };
          }

          // Actualizamos la compañía existente
          return await tx.company.update({
            where: { id: existingCompany.id },
            data: updateData,
            include: { branding: true },
          });
        } else {
          // Creamos una nueva compañía
          return await tx.company.create({
            data: companyData,
            include: { branding: true },
          });
        }
      },
      {
        isolationLevel: 'ReadCommitted',
        timeout: 15000,
      }
    );

    return results;
  } catch (error) {
    console.error('❌ Error al procesar las compañías:', error);
    return [];
  }
}
