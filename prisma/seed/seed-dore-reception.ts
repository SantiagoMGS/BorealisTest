import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { doreReceptionData } from './data/dore-reception.data';

export async function seedDoreReceptions(prisma: PrismaClient) {
  const logger = new Logger('DoreReceptionSeed');

  try {
    logger.log('Iniciando sembrado de recepciones de doré...');

    const receivedStatus = await prisma.status.findUnique({
      where: { name: 'RECIBIDO' },
    });

    if (!receivedStatus) {
      throw new Error('El estado RECIBIDO no existe en la base de datos');
    }

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

    for (const item of doreReceptionData) {
      const receptionData = item.reception;
      const doresData = item.dores;

      const company = await prisma.company.findUnique({
        where: { name: receptionData.company.connect.name },
      });

      if (!company) {
        logger.warn(
          `Compañía ${receptionData.company.connect.name} no encontrada. Omitiendo recepción...`,
        );
        continue;
      }

      const supplier = await prisma.supplier.findFirst({
        where: { name: receptionData.supplier.connect.name },
      });

      if (!supplier) {
        logger.warn(
          `Proveedor ${receptionData.supplier.connect.name} no encontrado. Omitiendo recepción...`,
        );
        continue;
      }

      const receptionType = await prisma.receptionType.findUnique({
        where: { name: receptionData.receptionType.connect.name },
      });

      if (!receptionType) {
        logger.warn(
          `Tipo de recepción ${receptionData.receptionType.connect.name} no encontrado. Omitiendo recepción...`,
        );
        continue;
      }

      const receptionOrigin = await prisma.receptionOrigin.findUnique({
        where: { name: receptionData.receptionOrigin.connect.name },
      });

      if (!receptionOrigin) {
        logger.warn(
          `Origen de recepción ${receptionData.receptionOrigin.connect.name} no encontrado. Omitiendo recepción...`,
        );
        continue;
      }

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

      const currentYear = new Date().getFullYear();
      const batchNumber = `${company.shortName}-D-${currentYear}-001`;

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
            receptionId: reception.id,
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
