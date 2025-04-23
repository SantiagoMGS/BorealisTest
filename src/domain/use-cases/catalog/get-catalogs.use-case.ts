import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { CatalogType } from '@presentation/controllers/common/dtos';

@Injectable()
export class GetCatalogsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(catalogType: CatalogType): Promise<any[]> {
    switch (catalogType) {
      case CatalogType.DOCUMENT_TYPES:
        return this.getDocumentTypes();
      case CatalogType.SUPPLIERS:
        return this.getSuppliers();
      case CatalogType.RECEPTION_TYPES:
        return this.getReceptionTypes();
      case CatalogType.RECEPTION_ORIGINS:
        return this.getReceptionOrigins();
      case CatalogType.ANALYSIS_TYPES:
        return this.getAnalysisTypes();
      default:
        return [];
    }
  }

  private async getDocumentTypes() {
    return this.prisma.documentType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
  }

  private async getSuppliers() {
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

  private async getReceptionTypes() {
    return this.prisma.receptionType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  private async getReceptionOrigins() {
    return this.prisma.receptionOrigin.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  private async getAnalysisTypes() {
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
