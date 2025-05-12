import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ReceptionTypeDataSourceService } from '../reception';
import {
  IDropdownData,
  IReceptionOrigin,
  ISample,
  ISupplier,
} from '@domain/interfaces/management/sample-management.interface';

@Injectable()
export class SampleManagementDataSourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly receptionTypeDataSource: ReceptionTypeDataSourceService,
  ) {}

  async getDropdownData(
    startDate: Date,
    endDate: Date,
  ): Promise<IDropdownData> {
    const suppliers = await this.getAvailableSuppliers(startDate, endDate);
    const samples = await this.getAvailableSamples(startDate, endDate);
    const receptionOrigins = await this.getAvailableReceptionOrigins(
      startDate,
      endDate,
    );

    return {
      suppliers,
      samples,
      receptionOrigins,
    };
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
    });

    return receptionOrigins.map(
      (receptionOrigin) => receptionOrigin.receptionOrigin,
    );
  }

  private async getAvailableSamples(
    startDate: Date,
    endDate: Date,
  ): Promise<ISample[]> {
    const samples = await this.prisma.sample.findMany({
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
    });

    return samples;
  }

  private async getAvailableSuppliers(
    startDate: Date,
    endDate: Date,
  ): Promise<ISupplier[]> {
    const sampleReceptionTypeId = (
      await this.receptionTypeDataSource.findByName('Muestra')
    ).id;

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
    });

    return suppliers.map((reception) => reception.supplier);
  }
}
