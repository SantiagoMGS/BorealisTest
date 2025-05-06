import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { IDoreReceptionEntity } from '@domain/entities/reception';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier/supplier.datasource.service';
import { ReceptionTypeDataSourceService } from './reception-type.datasource.service';
import { ReceptionOriginDataSourceService } from './reception-origin.datasource.service';
import { StatusDataSourceService } from '@infrastructure/datasource/status';
import { IDoreReceptionFilter } from '@domain/repositories/reception';
import { CityDataSourceService } from '@infrastructure/datasource/city/city.datasource.service';

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
  async createReception(reception: IDoreReceptionEntity): Promise<any> {
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
   * Filtra recepciones de doré por rango de fechas
   * @param filter Filtros a aplicar (startDate, endDate, supplierId, code)
   * @returns Lista de recepciones filtradas y proveedores asociados
   */
  async findByDateRange(filter: IDoreReceptionFilter): Promise<any> {
    try {
      // Construir los filtros para la consulta
      const whereClause: any = {
        isActive: true,
        // Buscar recepciones de tipo doré
        receptionType: {
          name: 'Doré', // Asumiendo que hay un tipo de recepción "Doré"
        },
      };

      // Agregar filtros de fecha si se proporcionan
      if (filter.startDate || filter.endDate) {
        whereClause.receptionDate = {};

        if (filter.startDate) {
          whereClause.receptionDate.gte = filter.startDate;
        }

        if (filter.endDate) {
          whereClause.receptionDate.lte = filter.endDate;
        }
      }

      // Filtrar por proveedor si se proporciona
      if (filter.supplierId) {
        whereClause.supplierId = filter.supplierId;
      }

      // Filtrar por código
      if (filter.code) {
        // Si hay un campo 'code' en la tabla de recepciones
        // (como un batchNumber o similar)
        whereClause.OR = [
          { batchNumber: { contains: filter.code, mode: 'insensitive' } },
          {
            supplier: {
              name: { contains: filter.code, mode: 'insensitive' },
            },
          },
        ];
      }

      // Buscar recepciones con los filtros aplicados
      const receptions = await this.prisma.reception.findMany({
        where: whereClause,
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
        },
      });

      // Construir filtro para los dorés
      const doreWhereClause: any = {
        isActive: true,
      };

      // Si hay un código, también filtrar dorés por código
      if (filter.code) {
        doreWhereClause.OR = [
          { code: { equals: parseInt(filter.code, 10) } }, // Si el código del doré es un número
          { observation: { contains: filter.code, mode: 'insensitive' } },
        ];
      }

      // Buscar los dorés filtrados
      const dores = await this.prisma.dore.findMany({
        where: doreWhereClause,
        include: {
          status: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Construir filtro para proveedores
      let supplierWhereClause: any = {
        isActive: true,
      };

      // Si hay un código, filtrar proveedores por nombre
      if (filter.code) {
        supplierWhereClause.OR = [
          { name: { contains: filter.code, mode: 'insensitive' } },
        ];
      }

      // Si hay un supplierId, filtrar específicamente ese proveedor
      if (filter.supplierId) {
        supplierWhereClause = {
          id: filter.supplierId,
          isActive: true,
        };
      } else {
        // Si no hay supplierId, obtener todos los proveedores de las recepciones filtradas
        const supplierIds = [...new Set(receptions.map((r) => r.supplierId))];
        if (supplierIds.length > 0) {
          supplierWhereClause.id = { in: supplierIds };
        }
      }

      const suppliers = await this.prisma.supplier.findMany({
        where: supplierWhereClause,
        select: {
          id: true,
          name: true,
        },
      });

      return {
        receptions,
        dores,
        suppliers,
      };
    } catch (error: any) {
      throw new BadRequestException(
        `Error al filtrar recepciones de doré: ${error.message}`,
      );
    }
  }
}
