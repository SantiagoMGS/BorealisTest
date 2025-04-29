import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

// Mapeo de orígenes y sus análisis por defecto
const defaultAnalysisMappings = [
  { origin: 'COLA', shortName: 'CO', analysisTypes: ['XRF', 'LW', 'AA'] },
  {
    origin: 'CABEZA MOLINO',
    shortName: 'CM',
    analysisTypes: ['DH', 'XRF', 'LW', 'AA'],
  },
  { origin: 'OVERFLOW', shortName: 'OV', analysisTypes: ['XRF', 'LW', 'AA'] },
  {
    origin: 'CONCENTRADO FLOTACION',
    shortName: 'CF',
    analysisTypes: ['XRF', 'LW', 'AA'],
  },
  {
    origin: 'MUESTRA DE MINA',
    shortName: 'MM',
    analysisTypes: ['XRF', 'LW', 'AA'],
  },
  { origin: 'BIG BAGS', shortName: 'BB', analysisTypes: ['XRF', 'LW', 'AA'] },
  { origin: 'SOLUCION LIQUIDA', shortName: 'SL', analysisTypes: ['PH', 'MC'] },
  {
    origin: 'SOLUCION BARREN',
    shortName: 'SB',
    analysisTypes: ['PH', 'MC', 'AA'],
  },
  {
    origin: 'MUESTRA DE PATIO O PILA',
    shortName: 'MP',
    analysisTypes: ['DH', 'LW', 'AA'],
  },
  {
    origin: 'MUESTRA AMBIENTAL',
    shortName: 'MX',
    analysisTypes: ['MX', 'PH', 'MC'],
  },
];

export const seedDefaultAnalysisOrigins = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedDefaultAnalysisOrigins');
  try {
    logger.log('Iniciando sembrado de análisis por defecto para orígenes...');

    // Verificar si ya existen asignaciones para evitar duplicados
    const existingCount = await prisma.defaultAnalysisTypeOrigin.count();

    if (existingCount > 0) {
      logger.log(
        `Ya existen ${existingCount} asignaciones de análisis por defecto. Omitiendo sembrado.`,
      );
      return;
    }

    // Procesar cada mapeo
    for (const mapping of defaultAnalysisMappings) {
      // Buscar el origen por su nombre
      const origin = await prisma.receptionOrigin.findFirst({
        where: {
          OR: [{ name: mapping.origin }, { shortName: mapping.shortName }],
        },
      });

      if (!origin) {
        logger.warn(
          `No se encontró el origen: ${mapping.origin} (${mapping.shortName})`,
        );
        continue;
      }

      // Para cada tipo de análisis, crear la relación
      for (const analysisShortName of mapping.analysisTypes) {
        // Buscar el tipo de análisis por nombre corto
        const analysisType = await prisma.analysisType.findUnique({
          where: { shortName: analysisShortName },
        });

        if (!analysisType) {
          logger.warn(
            `No se encontró el tipo de análisis: ${analysisShortName} para el origen ${mapping.origin}`,
          );
          continue;
        }

        // Crear la relación
        try {
          await prisma.defaultAnalysisTypeOrigin.create({
            data: {
              receptionOriginId: origin.id,
              analysisTypeId: analysisType.id,
            },
          });
          logger.log(
            `Asignado ${analysisShortName} como análisis predeterminado para ${mapping.origin}`,
          );
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Error desconocido';
          logger.error(
            `Error al asignar ${analysisShortName} a ${mapping.origin}: ${errorMessage}`,
          );
        }
      }
    }

    const finalCount = await prisma.defaultAnalysisTypeOrigin.count();
    logger.log(`Se crearon ${finalCount} asignaciones de análisis por defecto`);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    logger.error(
      `Error durante el sembrado de análisis por defecto: ${errorMessage}`,
    );
    throw error;
  }
};
