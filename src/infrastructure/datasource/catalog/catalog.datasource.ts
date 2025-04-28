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
}
