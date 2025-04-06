// prisma/seed/seed-companies.ts (versión mejorada)
import { Prisma, PrismaClient } from '@prisma/client';
import { companyInitialData } from '../data/companies.data';
import { batchTransaction } from '../utils/transaction.helper';

/**
 * Siembra los datos iniciales de compañías en la base de datos
 * Incluye validaciones y manejo seguro de relaciones anidadas
 *
 * @param prisma Instancia de PrismaClient configurada
 * @returns Array de compañías creadas/actualizadas
 */
export async function seedCompanies(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de compañías...');

  return batchTransaction(
    prisma,
    companyInitialData,
    async (tx, companyData) => {
      try {
        // Validamos que los datos de entrada tengan la estructura esperada
        if (!companyData.name || !companyData.shortName) {
          throw new Error(
            'Datos de compañía incompletos: se requiere name y shortName',
          );
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
          return tx.company.update({
            where: { id: existingCompany.id },
            data: updateData,
            include: { branding: true },
          });
        } else {
          // Creamos una nueva compañía
          return tx.company.create({
            data: companyData,
            include: { branding: true },
          });
        }
      } catch (error) {
        console.error(`Error procesando compañía ${companyData.name}:`, error);
        throw error; // Aseguramos que la transacción se revierta
      }
    },
    {
      isolationLevel: 'ReadCommitted',
      timeout: 15000, // 15 segundos, más tiempo para operaciones complejas
    },
  )
    .then((results) => {
      return results;
    })
    .catch((error) => {
      console.error('❌ Error durante el seed de compañías:', error);
      throw error; // Re-lanzamos el error para manejo superior
    });
}
