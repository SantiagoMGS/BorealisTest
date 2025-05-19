import { PrismaService } from '@core/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReceptionTypeDataSourceService } from '../reception';
import { ISampleDropdownData } from '@domain/interfaces/management/sample-dropdown.interface';
import { IManagementFilter } from '@domain/interfaces/management';
import { Prisma } from '@prisma/client';
import { SamplesWithAnalyses } from './types/sample-management-reception-select.type';
import { SupplierDropdown } from '@shared/types/supplier-dropdown.type';
import { SampleDropdown } from '@shared/types/sample-dropdown.type';
import { ReceptionOriginDropdown } from '@shared/types/reception-origin-dropdown.type';

@Injectable()
export class SampleManagementDataSourceService {
  private sampleReceptionTypeId: string | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly receptionTypeDataSource: ReceptionTypeDataSourceService,
  ) {}

  async findByFilters(
    filter: IManagementFilter,
  ): Promise<SamplesWithAnalyses[]> {
    const {
      startDate,
      endDate,
      supplierIds,
      receptionOriginIds,
      sampleIds,
      page = 1,
      limit = 10,
    } = filter;

    const sampleReceptionTypeId = await this.getSampleReceptionTypeId();

    const where: Prisma.ReceptionWhereInput = {
      receptionDate: {
        gte: startDate,
        lte: endDate,
      },
      receptionTypeId: sampleReceptionTypeId,
      ...(supplierIds?.length && {
        supplierId: { in: supplierIds },
      }),
      ...(receptionOriginIds?.length && {
        receptionOriginId: { in: receptionOriginIds },
      }),
      ...(sampleIds?.length && {
        samples: {
          some: {
            id: { in: sampleIds },
          },
        },
      }),
    };

    const data = await this.prisma.reception.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        receptionDate: true,
        isActive: true,
        samples: {
          select: {
            id: true,
            code: true,
            receivedWeight: true,
            receptionOrigin: {
              select: {
                name: true,
                shortName: true,
              },
            },
            requiredAnalyses: {
              select: {
                done: true,
                analysisType: {
                  select: {
                    name: true,
                    shortName: true,
                  },
                },
              },
            },
            analyses: {
              select: {
                analysisDate: true,
                analysisType: {
                  select: {
                    name: true,
                    shortName: true,
                  },
                },
                resultValue: true,
              },
            },
          },
        },
        supplier: {
          select: {
            name: true,
            shortName: true,
          },
        },
      },
      orderBy: {
        receptionDate: 'desc',
      },
    });

    if (data.length === 0) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return data;
  }

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
  ): Promise<ReceptionOriginDropdown[]> {
    const sampleReceptionTypeId = await this.getSampleReceptionTypeId();
    const receptionOrigins = await this.prisma.reception.findMany({
      where: {
        receptionDate: {
          gte: startDate,
          lte: endDate,
        },
        receptionTypeId: sampleReceptionTypeId,
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
  ): Promise<SampleDropdown[]> {
    const sampleReceptionTypeId = await this.getSampleReceptionTypeId();
    const samples = await this.prisma.reception.findMany({
      where: {
        receptionDate: {
          gte: startDate,
          lte: endDate,
        },
        receptionTypeId: sampleReceptionTypeId,
      },
      select: {
        samples: {
          select: {
            id: true,
            code: true,
          },
        },
      },
    });

    return samples.flatMap((r) => r.samples);
  }

  private async getAvailableSuppliers(
    startDate: Date,
    endDate: Date,
    sampleReceptionTypeId: string,
  ): Promise<SupplierDropdown[]> {
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
