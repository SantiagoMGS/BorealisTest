import { PrismaService } from '@core/prisma/prisma.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ReceptionTypeDataSourceService } from '../reception';
import {
  IDore,
  IDoreDropdownData,
  IDoreManagementResponse,
  IReceptionOrigin,
  ISupplier,
} from '@domain/interfaces/management/dore-management.interface';
import { IDoreReceptionResponse } from '@domain/interfaces';
import { IPaginatedData, PaginationHelper } from '@shared/index';
import { IManagementFilter } from '@domain/interfaces/management';
import { Prisma } from '@prisma/client';

@Injectable()
export class DoreManagementDataSourceService {
  private doreReceptionTypeId: string | null = null;

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
    const doreReceptionTypeId = await this.getDoreReceptionTypeId();

    const [suppliers, batchNumbers, receptionOrigins, dore] = await Promise.all(
      [
        this.getAvailableSuppliers(startDate, endDate, doreReceptionTypeId),
        this.getAvailableBatchNumbers(startDate, endDate, doreReceptionTypeId),
        this.getAvailableReceptionOrigins(
          startDate,
          endDate,
          doreReceptionTypeId,
        ),
        this.getAvailableDores(startDate, endDate),
      ],
    );

    if (
      receptionOrigins.length === 0 &&
      suppliers.length === 0 &&
      dore.length === 0 &&
      batchNumbers.length === 0
    ) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return {
      suppliers,
      dore,
      batchNumbers,
      receptionOrigins,
    };
  }

  private async getDoreReceptionTypeId(): Promise<string> {
    if (!this.doreReceptionTypeId) {
      const receptionType =
        await this.receptionTypeDataSource.findByName('Doré');
      this.doreReceptionTypeId = receptionType.id;
    }
    return this.doreReceptionTypeId;
  }

  private async getAvailableReceptionOrigins(
    startDate: Date,
    endDate: Date,
    doreReceptionTypeId: string,
  ): Promise<IReceptionOrigin[]> {
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
    return this.prisma.dore.findMany({
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
  }

  private async getAvailableSuppliers(
    startDate: Date,
    endDate: Date,
    doreReceptionTypeId: string,
  ): Promise<ISupplier[]> {
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
    doreReceptionTypeId: string,
  ): Promise<string[]> {
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

  /**
   * Obtiene recepciones de doré con filtros avanzados y paginación
   * @param filter Filtros extendidos y opciones de paginación
   * @returns Datos paginados de recepciones
   */
  async findByFilters(
    filter: IManagementFilter,
  ): Promise<IPaginatedData<IDoreManagementResponse>> {
    const {
      startDate,
      endDate,
      supplierIds,
      receptionOriginIds,
      doreIds,
      page = 1,
      limit = 10,
    } = filter;

    const doreReceptionTypeId = await this.getDoreReceptionTypeId();

    const where: Prisma.ReceptionWhereInput = {
      receptionDate: {
        gte: startDate,
        lte: endDate,
      },
      receptionTypeId: doreReceptionTypeId,
      ...(supplierIds?.length && {
        supplierId: { in: supplierIds },
      }),
      ...(receptionOriginIds?.length && {
        receptionOriginId: { in: receptionOriginIds },
      }),
      ...(doreIds?.length && {
        doreId: { in: doreIds },
      }),
    };

    const [total, data] = await Promise.all([
      this.prisma.reception.count({ where }),
      this.prisma.reception.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          batchNumber: true,
          receptionDate: true,
          observation: true,
          dore: {
            select: {
              id: true,
              code: true,
              receivedWeight: true,
              status: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
          receptionOrigin: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      items: data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }
}
