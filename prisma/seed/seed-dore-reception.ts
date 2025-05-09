import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { doreReceptionData } from './data/dore-reception.data';

/**
 * Siembra datos iniciales de recepciones de doré en la base de datos
 * @param prisma Instancia del cliente Prisma
 */
export async function seedDoreReceptions(prisma: PrismaClient) {
  const logger = new Logger('DoreReceptionSeed');

  try {
    logger.log('Iniciando sembrado de recepciones de doré...');

    // Obtener el estado "RECIBIDO"
    const receivedStatus = await prisma.status.findUnique({
      where: { name: 'RECIBIDO' },
    });

    if (!receivedStatus) {
      throw new Error('El estado RECIBIDO no existe en la base de datos');
    }

    // Verificar si ya existen recepciones de doré
    const existingReceptions = await prisma.reception.count({
      where: {
        receptionType: {
          name: 'Doré',
        },
      },
    });

    if (existingReceptions > 0) {
      logger.log(
        'Ya existen recepciones de doré en la base de datos. Omitiendo sembrado...',
      );
      return;
    }

    let receptionsCreated = 0;
    let doresCreated = 0;

    // Procesar cada par de recepción y sus dorés
    for (const item of doreReceptionData) {
      const receptionData = item.reception;
      const doresData = item.dores;

      // Obtener compañía
      const company = await prisma.company.findUnique({
        where: { name: receptionData.company.connect.name },
      });

      if (!company) {
        logger.warn(
          `Compañía ${receptionData.company.connect.name} no encontrada. Omitiendo recepción...`,
        );
        continue;
      }

      // Obtener proveedor
      const supplier = await prisma.supplier.findFirst({
        where: { name: receptionData.supplier.connect.name },
      });

      if (!supplier) {
        logger.warn(
          `Proveedor ${receptionData.supplier.connect.name} no encontrado. Omitiendo recepción...`,
        );
        continue;
      }

      // Obtener tipo de recepción
      const receptionType = await prisma.receptionType.findUnique({
        where: { name: receptionData.receptionType.connect.name },
      });

      if (!receptionType) {
        logger.warn(
          `Tipo de recepción ${receptionData.receptionType.connect.name} no encontrado. Omitiendo recepción...`,
        );
        continue;
      }

      // Obtener origen de recepción
      const receptionOrigin = await prisma.receptionOrigin.findUnique({
        where: { name: receptionData.receptionOrigin.connect.name },
      });

      if (!receptionOrigin) {
        logger.warn(
          `Origen de recepción ${receptionData.receptionOrigin.connect.name} no encontrado. Omitiendo recepción...`,
        );
        continue;
      }

      // Obtener ciudad por nombre
      const city = await prisma.city.findFirst({
        where: {
          name: receptionData.cityName,
        },
      });

      if (!city) {
        logger.warn(
          `Ciudad ${receptionData.cityName} no encontrada. Omitiendo recepción...`,
        );
        continue;
      }

      // Obtener título minero (si existe)
      let miningTitleId = undefined;
      if (receptionData.miningTitle) {
        const miningTitle = await prisma.supplierMiningTitle.findUnique({
          where: { name: receptionData.miningTitle.connect.name },
        });

        if (miningTitle) {
          miningTitleId = miningTitle.id;
        } else {
          logger.warn(
            `Título minero ${receptionData.miningTitle.connect.name} no encontrado. Procediendo sin él...`,
          );
        }
      }

      // Asignar directamente un número de lote formato ABC-D-2023-001
      const currentYear = new Date().getFullYear();
      const batchNumber = `${company.shortName}-D-${currentYear}-001`;

      // Crear la recepción
      const reception = await prisma.reception.create({
        data: {
          companyId: company.id,
          supplierId: supplier.id,
          receptionTypeId: receptionType.id,
          receptionOriginId: receptionOrigin.id,
          receptionDate: receptionData.receptionDate,
          batchNumber: batchNumber,
          observation: receptionData.observation,
          cityId: city.id,
          miningTitleId,
          isActive: receptionData.isActive,
        },
      });

      receptionsCreated++;
      logger.log(
        `Recepción creada: ${reception.id} - Lote: ${reception.batchNumber}`,
      );

      // Crear los dorés asociados a esta recepción
      for (const doreData of doresData) {
        const dore = await prisma.dore.create({
          data: {
            receivedWeight: doreData.receivedWeight,
            finalWeight: doreData.finalWeight,
            goldLaw: doreData.goldLaw,
            goldWeight: doreData.goldWeight,
            silverLaw: doreData.silverLaw,
            silverWeight: doreData.silverWeight,
            goldBalance: doreData.goldBalance,
            silverBalance: doreData.silverBalance,
            approvedLaw: doreData.approvedLaw,
            observation: doreData.observation,
            base64: doreData.base64,
            format: doreData.format,
            statusId: receivedStatus.id,
            receptionId: reception.id, // Vincular a la recepción recién creada
          },
        });

        doresCreated++;
        logger.log(`Doré creado: ${dore.id}`);
      }
    }

    logger.log(
      `✅ Sembrado completado: ${receptionsCreated} recepciones y ${doresCreated} dorés creados`,
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    logger.error(`Error al sembrar recepciones de doré: ${errorMessage}`);
    throw error;
  }
}
