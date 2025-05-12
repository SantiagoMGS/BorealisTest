import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { IDoreReceptionEntity } from '@domain/entities/reception';
import { IDoreReceptionResponse } from '@domain/interfaces/reception';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier/supplier.datasource.service';
import { ReceptionTypeDataSourceService } from './reception-type.datasource.service';
import { ReceptionOriginDataSourceService } from './reception-origin.datasource.service';
import { StatusDataSourceService } from '@infrastructure/datasource/status';
import { IDoreReceptionFilter } from '@domain/repositories/reception';
import { CityDataSourceService } from '@infrastructure/datasource/city/city.datasource.service';
import { IPaginatedData } from '@shared/interfaces/pagination.interfaces';
import { PaginationHelper } from '@shared/utils/pagination.helper';
import { IDoreDropdownData } from '@domain/interfaces/management/dore-management.interface';

@Injectable()
export class DoreReceptionDataSourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companyDataSource: CompanyDataSourceService,
    private readonly supplierDataSource: SupplierDataSourceService,
    private readonly receptionTypeDataSource: ReceptionTypeDataSourceService,
    private readonly receptionOriginDataSource: ReceptionOriginDataSourceService,
    private readonly statusDataSource: StatusDataSourceService,
    private readonly cityDataSource: CityDataSourceService,
  ) {}

  /**
   * @param reception Datos de la recepción
   * @returns La recepción creada con sus items
   */
  async createReception(
    reception: IDoreReceptionEntity,
  ): Promise<IDoreReceptionResponse> {
    try {
      // Verificamos que existan todas las entidades relacionadas
      await this.supplierDataSource.findById(reception.supplierId);
      await this.companyDataSource.findById(reception.companyId);
      await this.cityDataSource.findById(reception.cityId);
      // Obtener el tipo de recepción "Doré"
      const receptionType =
        await this.receptionTypeDataSource.findByName('Doré');
      const receptionTypeId = receptionType.id;

      await this.receptionOriginDataSource.findById(
        reception.receptionOriginId,
      );
      const receivedStatus = await this.statusDataSource.findByName('RECIBIDO');

      const createdReception = await this.prisma.reception.create({
        data: {
          companyId: reception.companyId,
          supplierId: reception.supplierId,
          receptionTypeId: receptionTypeId,
          receptionOriginId: reception.receptionOriginId,
          receptionDate: reception.receptionDate || new Date(),
          batchNumber: reception.batchNumber,
          observation: reception.observation,
          cityId: reception.cityId,
          miningTitleId: reception.miningTitleId,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              shortName: true,
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
          receptionType: {
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
      });

      const dores = [];
      for (const item of reception.items) {
        const dore = await this.prisma.dore.create({
          data: {
            receptionId: createdReception.id,
            receivedWeight: item.receivedWeight,
            observation: item.observation,
            statusId: receivedStatus.id,
            base64: item.images[0].base64,
            format: item.images[0].format,
          },
          include: {
            status: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        dores.push({
          receivedWeight: dore.receivedWeight,
          observation: dore.observation,
          base64: dore.base64,
          format: dore.format,
        });
      }

      return {
        ...createdReception,
        dores,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al crear la recepción de doré: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene el último número de lote para un proveedor específico con un prefijo dado
   * @param supplierId ID del proveedor
   * @param prefix Prefijo del lote (formato: [shortName]-D-[año])
   * @returns Último número de lote encontrado o null si no existe
   */
  async findLastBatchNumberBySupplierId(
    supplierId: string,
    prefix: string,
  ): Promise<string | null> {
    try {
      // Buscar las recepciones de doré del proveedor especificado con el prefijo dado
      const receptions = await this.prisma.reception.findMany({
        where: {
          supplierId,
          batchNumber: {
            startsWith: prefix,
          },
          receptionType: {
            name: 'Doré',
          },
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      });

      if (receptions.length === 0) {
        return null;
      }

      return receptions[0].batchNumber;
    } catch (error) {
      console.error('Error al buscar el último número de lote:', error);
      return null;
    }
  }

  /**
   * Obtiene recepciones de doré con filtros avanzados y paginación
   * @param filter Filtros extendidos y opciones de paginación
   * @returns Datos paginados de recepciones
   */
  async findByFilters(
    filter: IDoreReceptionFilter,
  ): Promise<IPaginatedData<IDoreReceptionResponse>> {
    try {
      // Construir los filtros para la consulta
      const whereClause: any = {
        isActive: true,
      };

      // Obtener el tipo de recepción "Doré"
      const receptionType =
        await this.receptionTypeDataSource.findByName('Doré');
      whereClause.receptionTypeId = receptionType.id;

      // Filtrar por rango de fechas
      if (filter.startDate || filter.endDate) {
        whereClause.receptionDate = {};

        if (filter.startDate) {
          whereClause.receptionDate.gte = filter.startDate;
        }

        if (filter.endDate) {
          whereClause.receptionDate.lte = filter.endDate;
        }
      }

      // Filtrar por proveedores
      if (filter.supplierIds && filter.supplierIds.length > 0) {
        whereClause.supplierId = { in: filter.supplierIds };
      }

      // Filtrar por orígenes de recepción
      if (filter.receptionOriginIds && filter.receptionOriginIds.length > 0) {
        whereClause.receptionOriginId = { in: filter.receptionOriginIds };
      }

      // Filtrar por números de lote
      if (filter.batchNumbers && filter.batchNumbers.length > 0) {
        whereClause.batchNumber = { in: filter.batchNumbers };
      }

      // Calcular total de registros para la paginación
      const totalItems = await this.prisma.reception.count({
        where: whereClause,
      });

      // Calcular skip y take para la paginación
      const skip = (filter.page - 1) * filter.limit;
      const take = filter.limit;

      // Buscar recepciones con los filtros aplicados y paginación
      const receptions = await this.prisma.reception.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: {
          receptionDate: 'desc',
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              shortName: true,
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
          receptionType: {
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
          // Incluir dorés asociados a la recepción
          dore: {
            select: {
              id: true,
              code: true,
              receivedWeight: true,
              finalWeight: true,
              goldLaw: true,
              goldWeight: true,
              silverLaw: true,
              silverWeight: true,
              goldBalance: true,
              silverBalance: true,
              approvedLaw: true,
              observation: true,
              base64: true,
              format: true,
              status: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      // Si hay filtro por doreIds, filtramos las recepciones que tengan esos dorés
      if (filter.doreIds && filter.doreIds.length > 0) {
        const doreReceptions = await this.prisma.dore.findMany({
          where: {
            id: { in: filter.doreIds },
            isActive: true,
          },
          select: {
            receptionId: true,
          },
        });

        const receptionIds = [
          ...new Set(doreReceptions.map((d) => d.receptionId)),
        ];

        // Filtramos las recepciones que coincidan con los IDs de dore
        const filteredReceptions = receptions.filter((reception) =>
          receptionIds.includes(reception.id),
        );

        // Crear el objeto de respuesta paginada
        return PaginationHelper.createPaginatedResponseFromItems(
          filteredReceptions as unknown as IDoreReceptionResponse[],
          filteredReceptions.length,
          filter,
        );
      }

      // Crear el objeto de respuesta paginada
      return PaginationHelper.createPaginatedResponseFromItems(
        receptions as unknown as IDoreReceptionResponse[],
        totalItems,
        filter,
      );
    } catch (error: any) {
      throw new BadRequestException(
        `Error al filtrar recepciones de doré: ${error.message}`,
      );
    }
  }
}
