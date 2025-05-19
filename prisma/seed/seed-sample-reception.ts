import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { sampleReceptionData } from './data/sample-reception.data';

export async function seedSampleReceptions(prisma: PrismaClient) {
  const logger = new Logger('SampleReceptionSeed');

  try {
    logger.log('Iniciando sembrado de recepciones de muestras...');

    const receivedStatus = await prisma.status.findUnique({
      where: { name: 'RECIBIDO' },
    });

    if (!receivedStatus) {
      throw new Error('El estado RECIBIDO no existe en la base de datos');
    }

    const existingReceptions = await prisma.reception.count({
      where: {
        receptionType: {
          name: 'Muestra',
        },
      },
    });

    if (existingReceptions > 0) {
      logger.log(
        'Ya existen recepciones de muestras en la base de datos. Omitiendo sembrado...',
      );
      return;
    }

    let receptionsCreated = 0;
    let samplesCreated = 0;
    let requiredAnalysesCreated = 0;
    let analysesCreated = 0;

    for (const item of sampleReceptionData) {
      const receptionData = item.reception;
      const samplesData = item.samples;

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

      // Buscar el origen de recepción adecuado
      // Para muestras, necesitamos buscar el origen especificado en cada muestra individual
      // Vamos a usar el primer origen como origen principal para la recepción
      let mainReceptionOrigin = null;
      if (samplesData.length > 0) {
        mainReceptionOrigin = await prisma.receptionOrigin.findUnique({
          where: { name: samplesData[0].receptionOrigin.connect.name },
        });

        if (!mainReceptionOrigin) {
          logger.warn(
            `Origen de recepción ${samplesData[0].receptionOrigin.connect.name} no encontrado. Omitiendo recepción...`,
          );
          continue;
        }
      } else {
        logger.warn(
          `No hay muestras definidas para la recepción. Omitiendo recepción...`,
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

      // Crear la recepción con el modelo correcto según el esquema
      const reception = await prisma.reception.create({
        data: {
          companyId: company.id,
          supplierId: supplier.id,
          receptionTypeId: receptionType.id,
          receptionOriginId: mainReceptionOrigin.id, // Campo requerido según el esquema
          receptionDate: receptionData.receptionDate,
          batchNumber: receptionData.batchNumber,
          observation: receptionData.observation,
          cityId: city.id,
          isActive: receptionData.isActive,
        },
      });

      receptionsCreated++;
      logger.log(
        `Recepción creada: ${reception.id} - Lote: ${reception.batchNumber}`,
      );

      // Procesar cada muestra asociada a esta recepción
      for (const sampleData of samplesData) {
        const sampleReceptionOrigin = await prisma.receptionOrigin.findUnique({
          where: { name: sampleData.receptionOrigin.connect.name },
        });

        if (!sampleReceptionOrigin) {
          logger.warn(
            `Origen de recepción ${sampleData.receptionOrigin.connect.name} para muestra no encontrado. Omitiendo muestra...`,
          );
          continue;
        }

        // Crear la muestra
        const sample = await prisma.sample.create({
          data: {
            receptionId: reception.id,
            receptionOriginId: sampleReceptionOrigin.id,
            receivedWeight: sampleData.receivedWeight,
            code: sampleData.code,
            statusId: receivedStatus.id,
          },
        });

        samplesCreated++;
        logger.log(`Muestra creada: ${sample.id} - Código: ${sample.code}`);

        // Procesar los análisis requeridos para esta muestra
        if (
          sampleData.requiredAnalyses &&
          sampleData.requiredAnalyses.length > 0
        ) {
          for (const analysisData of sampleData.requiredAnalyses) {
            const analysisType = await prisma.analysisType.findUnique({
              where: { name: analysisData.analysisType.connect.name },
            });

            if (!analysisType) {
              logger.warn(
                `Tipo de análisis ${analysisData.analysisType.connect.name} no encontrado. Omitiendo análisis requerido...`,
              );
              continue;
            }

            // Crear el análisis requerido
            const requiredAnalysis = await prisma.sampleRequiredAnalysis.create(
              {
                data: {
                  sampleId: sample.id,
                  analysisTypeId: analysisType.id,
                  done: analysisData.done,
                },
              },
            );

            requiredAnalysesCreated++;
            logger.log(`Análisis requerido creado: ${requiredAnalysis.id}`);
          }
        }

        // Procesar los análisis para esta muestra
        if ('analyses' in sampleData && sampleData.analyses && Array.isArray(sampleData.analyses) && sampleData.analyses.length > 0) {
          for (const analysisData of sampleData.analyses) {
            const analysisType = await prisma.analysisType.findUnique({
              where: { name: analysisData.analysisType.connect.name },
            });

            if (!analysisType) {
              logger.warn(
                `Tipo de análisis ${analysisData.analysisType.connect.name} no encontrado. Omitiendo análisis...`,
              );
              continue;
            }

            // Crear el análisis siguiendo el formato similar a createLWAnalysis
            try {
              // Obtener el resultValue que está anidado dentro del objeto analysisType en los datos
              const analysisDataAny = analysisData as any;
              let resultValue = analysisDataAny.resultValue || 
                (analysisDataAny.analysisType?.resultValue) || {};

              // Si es un análisis de DETERMINACION DE HUMEDAD, calcular moisture
              if (analysisType.shortName === 'DH' && resultValue.dryWeight) {
                const receivedWeight = Number(sample.receivedWeight);
                const dryWeight = Number(resultValue.dryWeight);
                
                // Verificar que el peso seco no sea mayor al recibido
                if (dryWeight <= receivedWeight) {
                  const moisture = (1 - dryWeight / receivedWeight) * 100;
                  // Agregar el moisture al resultValue, con 4 decimales
                  resultValue = {
                    ...resultValue,
                    moisture: parseFloat(moisture.toFixed(4))
                  };
                }
              }

              const createdAnalysis = await prisma.analysis.create({
                data: {
                  sampleId: sample.id,
                  analysisDate: analysisDataAny.analysisDate || new Date(),
                  analysisTypeId: analysisType.id,
                  resultValue,
                },
              });

              analysesCreated++;
              logger.log(`Análisis creado: ${createdAnalysis.id}`);
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
              logger.error(`Error al crear análisis: ${errorMessage}`);
              continue;
            }
          }
        }
      }
    }

    logger.log(
      `✅ Sembrado completado: ${receptionsCreated} recepciones, ${samplesCreated} muestras, ${requiredAnalysesCreated} análisis requeridos y ${analysesCreated} análisis creados`,
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    logger.error(`Error al sembrar recepciones de muestras: ${errorMessage}`);
    throw error;
  }
}
