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

    // Obtener los análisis por defecto desde la base de datos
    const defaultAnalysis =
      await this.prisma.defaultAnalysisTypeOrigin.findMany({
        where: {
          receptionOriginId: originId,
        },
        include: {
          analysisType: {
            select: {
              id: true,
              name: true,
              shortName: true,
            },
          },
        },
      });

    // Si no hay análisis por defecto, devolver arreglo vacío
    if (defaultAnalysis.length === 0) {
      return [];
    }

    // Transformar los resultados al formato esperado
    return defaultAnalysis.map(
      (item: {
        analysisType: { id: string; name: string; shortName: string };
      }) => ({
        id: item.analysisType.id,
        name: item.analysisType.name,
        shortName: item.analysisType.shortName,
        selected: true,
      }),
    );
  }
}
