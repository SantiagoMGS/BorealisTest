import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';

/**
 * Datasource para acceder a los datos de catálogos en la base de datos
 */
@Injectable()
export class CatalogDatasource {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene los tipos de documento activos
   */
  async getDocumentTypes() {
    return this.prisma.documentType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
  }

  /**
   * Obtiene los proveedores activos
   */
  async getSuppliers() {
    return this.prisma.supplier.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        documentTypeId: true,
        documentNumber: true,
      },
    });
  }

  /**
   * Obtiene los tipos de recepción activos
   */
  async getReceptionTypes() {
    return this.prisma.receptionType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  /**
   * Obtiene los orígenes de recepción activos
   */
  async getReceptionOrigins() {
    return this.prisma.receptionOrigin.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  /**
   * Obtiene los tipos de análisis activos
   */
  async getAnalysisTypes() {
    return this.prisma.analysisType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }
}
