import { Prisma, PrismaClient } from '@prisma/client';
import { companyInitialData } from '../data/';
import { batchTransaction } from '../utils/transaction.helper';

/**
 * Tipo que representa un cliente Prisma dentro de una transacción
 * Omite los métodos que no están disponibles dentro de una transacción
 */
type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

/**
 * Función para sembrar datos iniciales de compañías
 * @param prisma Instancia del cliente Prisma
 * @returns Array de compañías creadas/actualizadas
 */
export async function seedCompanies(prisma: PrismaClient) {
  console.log('🔄 Iniciando seed de compañías...');

  const results = await batchTransaction(
    prisma,
    companyInitialData,
    async (tx: TransactionClient, companyData, index) => {
      // Verificamos si la compañía ya existe
      const existingCompany = await tx.company.findUnique({
        where: { name: companyData.name },
        include: { branding: true },
      });

      // Extraemos los datos de branding de forma segura usando type guards
      const hasBranding =
        companyData.branding !== undefined &&
        companyData.branding !== null &&
        typeof companyData.branding === 'object';

      const brandingCreateData =
        hasBranding &&
        'create' in companyData.branding! &&
        companyData.branding.create
          ? companyData.branding.create
          : null;

      if (existingCompany) {
        // Si la compañía existe, la actualizamos
        const updateData: Prisma.CompanyUpdateInput = {
          shortName: companyData.shortName,
          isActive: companyData.isActive ?? existingCompany.isActive,
        };

        // Solo incluimos la actualización de branding si tenemos datos para ello
        if (brandingCreateData) {
          if (existingCompany.branding) {
            // Si ya existe un branding, lo actualizamos
            updateData.branding = {
              update: brandingCreateData,
            };
          } else {
            // Si no existe un branding, lo creamos
            updateData.branding = {
              create: brandingCreateData,
            };
          }
        }

        const result = await tx.company.update({
          where: { id: existingCompany.id },
          data: updateData,
          include: { branding: true }, // Incluimos branding en la respuesta
        });

        return result;
      } else {
        // Si la compañía no existe, la creamos
        const result = await tx.company.create({
          data: companyData,
          include: { branding: true }, // Incluimos branding en la respuesta
        });

        return result;
      }
    },
    // Opciones de la transacción
    {
      timeout: 10000,
      isolationLevel: 'Serializable',
    },
  );

  console.log(`🟢 ${results.length} compañías procesadas correctamente`);
  return results;
}
