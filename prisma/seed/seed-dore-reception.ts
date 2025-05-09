import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { doreReceptionData } from './data/dore-reception.data';
import { GetNextBatchNumberUseCase } from '@domain/use-cases/reception/get-next-batch-number.usecase';
import { SupplierRepository } from '@domain/repositories/supplier';
import { DoreReceptionRepository } from '@domain/repositories/reception/dore-reception.repository';
import { ISupplierResponse } from '@domain/interfaces/supplier';
import {
  IDoreReceptionFilter,
  IDoreDropdownData,
} from '@domain/repositories/reception/dore-reception.repository';

/**
 * Siembra datos iniciales de recepciones de doré en la base de datos
 * @param prisma Instancia del cliente Prisma
 */
export async function seedDoreReceptions(prisma: PrismaClient) {
  const logger = new Logger('DoreReceptionSeed');

  try {
    logger.log('Iniciando sembrado de recepciones de doré...');

    // Crear implementaciones temporales de los repositorios para el caso de uso
    const supplierRepository: SupplierRepository = {
      findById: async (id: string): Promise<ISupplierResponse> => {
        const supplier = await prisma.supplier.findUnique({
          where: { id },
        });

        if (!supplier) {
          throw new Error(`Proveedor con ID ${id} no encontrado`);
        }

        return {
          id: supplier.id,
          name: supplier.name,
          documentTypeId: supplier.documentTypeId,
          documentNumber: supplier.documentNumber,
          shortName: supplier.shortName || '',
          verificationDigit: supplier.verificationDigit,
          isActive: supplier.isActive,
        };
      },
      // Implementamos los métodos abstractos requeridos con implementaciones mínimas
      findAll: async (): Promise<ISupplierResponse[]> => [],
      createSupplier: async () => ({
        id: '',
        name: '',
        documentTypeId: '',
        documentNumber: '',
        shortName: '',
      }),
      update: async () => ({
        id: '',
        name: '',
        documentTypeId: '',
        documentNumber: '',
        shortName: '',
      }),
      delete: async () => ({
        id: '',
        name: '',
        documentTypeId: '',
        documentNumber: '',
        shortName: '',
      }),
      findByParams: async () => ({
        id: '',
        name: '',
        documentTypeId: '',
        documentNumber: '',
        shortName: '',
      }),
      findMiningTitles: async () => [],
    };

    const doreReceptionRepository: DoreReceptionRepository = {
      findLastBatchNumberBySupplierId: async (
        supplierId: string,
        prefix: string,
      ): Promise<string | null> => {
        const lastReception = await prisma.reception.findFirst({
          where: {
            supplierId,
            batchNumber: {
              startsWith: prefix,
            },
          },
          orderBy: {
            batchNumber: 'desc',
          },
        });
        return lastReception?.batchNumber || null;
      },
      // Implementamos los métodos abstractos requeridos con implementaciones mínimas
      createDoreReception: async () => ({}),
      findByDateRange: async () => ({}),
      getDropdownData: async (): Promise<IDoreDropdownData> => ({
        suppliers: [],
        dore: [],
        batchNumbers: [],
        receptionOrigins: [],
      }),
    };

    // Crear el caso de uso
    const getNextBatchNumberUseCase = new GetNextBatchNumberUseCase(
      supplierRepository,
      doreReceptionRepository,
    );

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

      // Generar el siguiente número de lote para el proveedor
      const batchNumber = await getNextBatchNumberUseCase.execute(supplier.id);

      // Crear la recepción
      const reception = await prisma.reception.create({
        data: {
          companyId: company.id,
          supplierId: supplier.id,
          receptionTypeId: receptionType.id,
          receptionOriginId: receptionOrigin.id,
          receptionDate: receptionData.receptionDate,
          batchNumber: batchNumber, // Usar el número de lote generado
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
