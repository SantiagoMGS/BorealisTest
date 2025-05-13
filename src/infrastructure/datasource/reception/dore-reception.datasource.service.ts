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
      return null;
    }
  }
}
