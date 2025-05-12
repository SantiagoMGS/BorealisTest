import { PrismaService } from '@core/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReceptionTypeDataSourceService } from '../reception';
import {
  IDore,
  IDoreDropdownData,
  IReceptionOrigin,
  ISupplier,
} from '@domain/interfaces/management/dore-management.interface';

@Injectable()
export class DoreManagementDataSourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly receptionTypeDataSource: ReceptionTypeDataSourceService,
  ) {}

  /**
   * Obtiene datos para llenar los dropdowns del frontend
   * @param startDate Fecha inicial para filtrar
   * @param endDate Fecha final para filtrar
   * @returns Datos para los dropdowns (proveedores, dorés, números de lote, orígenes)
   */
  async getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<IDoreDropdownData> {
    const suppliers = await this.getAvailableSuppliers(startDate, endDate);
    const batchNumbers = await this.getAvailableBatchNumbers(
      startDate,
      endDate,
    );
    const receptionOrigins = await this.getAvailableReceptionOrigins(
      startDate,
      endDate,
    );
    const dores = await this.getAvailableDores(startDate, endDate);

    if (
      receptionOrigins.length === 0 &&
      suppliers.length === 0 &&
      dores.length === 0 &&
      batchNumbers.length === 0
    ) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return {
      suppliers,
      dores,
      batchNumbers,
      receptionOrigins,
    };
  }

  private async getAvailableReceptionOrigins(
    startDate: Date,
    endDate: Date,
  ): Promise<IReceptionOrigin[]> {
    const doreReceptionTypeId = (
      await this.receptionTypeDataSource.findByName('Doré')
    ).id;

    const receptionOrigins = await this.prisma.reception.findMany({
      where: {
        receptionTypeId: doreReceptionTypeId,
        isActive: true,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        receptionOrigin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return receptionOrigins.map((r) => r.receptionOrigin);
  }

  private async getAvailableDores(
    startDate: Date,
    endDate: Date,
  ): Promise<IDore[]> {
    const dores = await this.prisma.dore.findMany({
      where: {
        isActive: true,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        code: true,
      },
      orderBy: {
        code: 'asc',
      },
    });

    return dores;
  }

  private async getAvailableSuppliers(
    startDate: Date,
    endDate: Date,
  ): Promise<ISupplier[]> {
    const doreReceptionTypeId = (
      await this.receptionTypeDataSource.findByName('Doré')
    ).id;

    const suppliers = await this.prisma.reception.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        receptionTypeId: doreReceptionTypeId,
      },
      select: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      distinct: ['supplierId'],
      orderBy: {
        supplier: {
          name: 'asc',
        },
      },
    });

    return suppliers.map((reception) => reception.supplier);
  }

  private async getAvailableBatchNumbers(
    startDate: Date,
    endDate: Date,
  ): Promise<string[]> {
    const doreReceptionTypeId = (
      await this.receptionTypeDataSource.findByName('Doré')
    ).id;

    const batchNumbers = await this.prisma.reception.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        receptionTypeId: doreReceptionTypeId,
      },
      select: {
        batchNumber: true,
      },
      distinct: ['batchNumber'],
    });

    return batchNumbers.map((reception) => reception.batchNumber as string);
  }
}
