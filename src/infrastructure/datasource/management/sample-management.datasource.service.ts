import { PrismaService } from '@core/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReceptionTypeDataSourceService } from '../reception';
import {
  ISampleDropdownData,
  IReceptionOrigin,
  ISample,
  ISupplier,
} from '@domain/interfaces/management/sample-management.interface';

@Injectable()
export class SampleManagementDataSourceService {
  private sampleReceptionTypeId: string | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly receptionTypeDataSource: ReceptionTypeDataSourceService,
  ) {}

  /**
   * Obtiene datos para llenar los dropdowns del frontend
   * @param startDate Fecha inicial para filtrar
   * @param endDate Fecha final para filtrar
   * @returns Datos para los dropdowns (proveedores, muestras, orígenes)
   */
  async getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<ISampleDropdownData> {
    const sampleReceptionTypeId = await this.getSampleReceptionTypeId();

    const [suppliers, samples, receptionOrigins] = await Promise.all([
      this.getAvailableSuppliers(startDate, endDate, sampleReceptionTypeId),
      this.getAvailableSamples(startDate, endDate),
      this.getAvailableReceptionOrigins(startDate, endDate),
    ]);

    if (
      receptionOrigins.length === 0 &&
      suppliers.length === 0 &&
      samples.length === 0
    ) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return {
      suppliers,
      samples,
      receptionOrigins,
    };
  }

  /**
   * Obtiene y cachea el ID del tipo de recepción "Muestra"
   */
  private async getSampleReceptionTypeId(): Promise<string> {
    if (!this.sampleReceptionTypeId) {
      const receptionType =
        await this.receptionTypeDataSource.findByName('Muestra');
      this.sampleReceptionTypeId = receptionType.id;
    }
    return this.sampleReceptionTypeId;
  }

  private async getAvailableReceptionOrigins(
    startDate: Date,
    endDate: Date,
  ): Promise<IReceptionOrigin[]> {
    const receptionOrigins = await this.prisma.sample.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        receptionOrigin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      distinct: ['receptionOriginId'],
      orderBy: {
        receptionOrigin: {
          name: 'asc',
        },
      },
    });

    return receptionOrigins.map(
      (receptionOrigin) => receptionOrigin.receptionOrigin,
    );
  }

  private async getAvailableSamples(
    startDate: Date,
    endDate: Date,
  ): Promise<ISample[]> {
    return this.prisma.sample.findMany({
      where: {
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
  }

  private async getAvailableSuppliers(
    startDate: Date,
    endDate: Date,
    sampleReceptionTypeId: string,
  ): Promise<ISupplier[]> {
    const suppliers = await this.prisma.reception.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        receptionTypeId: sampleReceptionTypeId,
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
}
