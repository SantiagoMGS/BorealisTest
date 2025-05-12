import { PrismaService } from '@core/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReceptionTypeDataSourceService } from '../reception';
import {
  ISampleDropdownData,
  IReceptionOrigin,
  ISample,
  ISupplier,
} from '@domain/interfaces/management/sample-management.interface';
import { IManagementFilter } from '@domain/interfaces/management';
import { IPaginatedData } from '@shared/interfaces/pagination.interfaces';
import { PaginationHelper } from '@shared/utils/pagination.helper';

@Injectable()
export class SampleManagementDataSourceService {
  private sampleReceptionTypeId: string | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly receptionTypeDataSource: ReceptionTypeDataSourceService,
  ) {}

  async findByFilters(filter: IManagementFilter): Promise<IPaginatedData<any>> {
    const {
      startDate,
      endDate,
      supplierIds,
      receptionOriginIds,
      sampleIds,
      page,
      limit,
    } = filter;

    // Construir filtros para la consulta
    const whereClause: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Añadir filtro por IDs de muestras si se proporcionan
    if (sampleIds && sampleIds.length > 0) {
      whereClause.id = { in: sampleIds };
    }

    // Añadir filtro por orígenes de recepción si se proporcionan
    if (receptionOriginIds && receptionOriginIds.length > 0) {
      whereClause.receptionOriginId = { in: receptionOriginIds };
    }

    // Añadir filtro por proveedores si se proporcionan
    // Nota: Esto requiere buscar primero las recepciones asociadas a estos proveedores
    let receptionIds: string[] | undefined;
    if (supplierIds && supplierIds.length > 0) {
      const sampleReceptionTypeId = await this.getSampleReceptionTypeId();

      const receptions = await this.prisma.reception.findMany({
        where: {
          supplierId: { in: supplierIds },
          receptionTypeId: sampleReceptionTypeId,
        },
        select: { id: true },
      });

      receptionIds = receptions.map((reception) => reception.id);

      if (receptionIds.length > 0) {
        whereClause.receptionId = { in: receptionIds };
      } else if (supplierIds.length > 0) {
        // Si se especificaron proveedores pero no hay recepciones, forzar resultado vacío
        return {
          items: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }
    }

    // Obtener el conteo total de registros que coinciden con los filtros
    const totalItems = await this.prisma.sample.count({
      where: whereClause,
    });

    // Aplicar paginación y obtener datos
    const samples = await this.prisma.sample.findMany({
      where: whereClause,
      include: {
        receptionOrigin: {
          select: {
            id: true,
            name: true,
          },
        },
        reception: {
          select: {
            id: true,
            batchNumber: true,
            receptionDate: true,
            supplier: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Usar PaginationHelper para crear la respuesta paginada
    return PaginationHelper.createPaginatedResponseFromItems(
      samples,
      totalItems,
      { page, limit },
    );
  }

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
