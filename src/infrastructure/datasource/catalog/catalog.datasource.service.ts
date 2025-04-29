import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';

@Injectable()
export class CatalogDatasource {
  constructor(private readonly prisma: PrismaService) {}

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

  async getCities() {
    return this.prisma.city.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        daneCode: true,
        departmentId: true,
      },
    });
  }

  async getDepartments() {
    return this.prisma.department.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        daneCode: true,
        countryId: true,
      },
    });
  }

  async getDoreReceptionTypes() {
    // Buscar el ID del tipo de recepción 'Doré'
    const doreReceptionType = await this.prisma.receptionType.findFirst({
      where: {
        name: 'Doré',
        isActive: true,
      },
    });

    if (!doreReceptionType) {
      return [];
    }

    // Obtener los orígenes asociados al tipo Doré
    const doreOrigins = await this.prisma.receptionTypeOrigin.findMany({
      where: {
        receptionTypeId: doreReceptionType.id,
      },
      select: {
        receptionOrigin: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    // Transformar a formato requerido
    return doreOrigins.map((item) => ({
      id: item.receptionOrigin.id,
      name: item.receptionOrigin.name,
      description: item.receptionOrigin.description,
    }));
  }

  async getSampleReceptionTypes() {
    // Buscar el ID del tipo de recepción 'Muestra'
    const sampleReceptionType = await this.prisma.receptionType.findFirst({
      where: {
        name: 'Muestra',
        isActive: true,
      },
    });

    if (!sampleReceptionType) {
      return [];
    }

    // Obtener los orígenes asociados al tipo Muestra
    const sampleOrigins = await this.prisma.receptionTypeOrigin.findMany({
      where: {
        receptionTypeId: sampleReceptionType.id,
      },
      select: {
        receptionOrigin: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    // Transformar a formato requerido
    return sampleOrigins.map((item) => ({
      id: item.receptionOrigin.id,
      name: item.receptionOrigin.name,
      description: item.receptionOrigin.description,
    }));
  }
}
