import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReceptionOrigin } from '@prisma/client';

@Injectable()
export class ReceptionOriginDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca un origen de recepción por su ID
   * @param id ID del origen de recepción
   * @returns El origen de recepción encontrado
   * @throws NotFoundException si no se encuentra el origen de recepción
   */
  async findById(id: string): Promise<ReceptionOrigin> {
    const origin = await this.prisma.receptionOrigin.findUnique({
      where: { id },
    });

    if (!origin) {
      throw new NotFoundException(
        `No se encontró el origen de recepción con ID ${id}`,
      );
    }

    return origin;
  }

  /**
   * Obtiene los análisis por defecto asociados a un origen de recepción
   */
  async getDefaultAnalysisByOriginId(originId: string) {
    // Primero verificamos que el origen existe
    const origin = await this.findById(originId);

    // Obtener todos los tipos de análisis disponibles
    const allAnalysisTypes = await this.prisma.analysisType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        shortName: true,
      },
    });

    // Definir reglas de análisis por defecto basadas en el origen
    // Estas reglas podrían ser almacenadas en la base de datos en una implementación futura
    const defaultAnalysisByOrigin: Record<string, string[]> = {
      COLA: ['XRF', 'LW', 'AA'],
      'CABEZA MOLINO': ['XRF', 'AA'],
      OVERFLOW: ['XRF', 'AA'],
      'CONCENTRADO FLOTACION': ['XRF', 'AA', 'EF'],
      'MUESTRA DE MINA': ['XRF', 'LW'],
      'BIG BAGS': ['XRF', 'AA', 'G'],
      'SOLUCION LIQUIDA': ['AA', 'PH'],
      'SOLUCION BARREN': ['AA', 'MC', 'PH'],
      'MUESTRA DE PATIO O PILA': ['XRF', 'AA', 'DH'],
      'MUESTRA AMBIENTAL': ['XRF', 'AA', 'PH'],
      'Minería de Subsistencia': ['EF'],
      'Joyería Desuso': ['EF'],
      'Joyería de Plata': ['EF'],
      'Veta Fundido': ['EF', 'XRF'],
      'Plata Fundida': ['EF'],
    };

    // Buscar los análisis por defecto para este origen
    const defaultAnalysisShortNames =
      defaultAnalysisByOrigin[origin.name] || [];

    // Si no hay análisis por defecto, devolver arreglo vacío
    if (defaultAnalysisShortNames.length === 0) {
      return [];
    }

    // Filtrar los tipos de análisis según los nombres cortos de los análisis por defecto
    const defaultAnalysis = allAnalysisTypes
      .filter((analysisType) =>
        defaultAnalysisShortNames.includes(analysisType.shortName),
      )
      .map(({ id, name }) => ({ id, name }));

    return defaultAnalysis;
  }
}
