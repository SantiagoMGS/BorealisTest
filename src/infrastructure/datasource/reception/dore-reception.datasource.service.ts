import {
  BadRequestException,
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
import { UpdateDoreReceptionDto } from '@presentation/controllers/management/dtos/update-dore-reception.dto';

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

  async createReception(
    reception: IDoreReceptionEntity,
  ): Promise<IDoreReceptionResponse> {
    try {
      await this.supplierDataSource.findById(reception.supplierId);
      await this.companyDataSource.findById(reception.companyId);
      await this.cityDataSource.findById(reception.cityId);

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

  async findLastBatchNumberBySupplierId(
    supplierId: string,
    prefix: string,
  ): Promise<string | null> {
    try {
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

  async deleteReception(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('El ID de la recepción es requerido');
    }

    try {
      // Verificar que la recepción existe
      const receptionExists = await this.prisma.dore.findUnique({
        where: { id },
      });

      if (!receptionExists) {
        throw new NotFoundException(`No se encontró la recepción con ID ${id}`);
      }

      await this.prisma.dore.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al eliminar la recepción: ${errorMessage}`,
      );
    }
  }

  async updateReception(
    updateData: UpdateDoreReceptionDto,
  ): Promise<IDoreReceptionResponse> {
    try {
      const dore = await this.prisma.dore.update({
        where: { id: updateData.id },
        data: {
          receivedWeight: updateData.receivedWeight,
          finalWeight: updateData.finalWeight,
          observation: updateData.observation,
          base64: updateData.base64,
          format: updateData.format,
        },
        include: {
          reception: {
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
          },
        },
      });

      return {
        id: dore.reception.id,
        companyId: dore.reception.companyId,
        supplierId: dore.reception.supplierId,
        receptionTypeId: dore.reception.receptionTypeId,
        receptionOriginId: dore.reception.receptionOriginId,
        receptionDate: dore.reception.receptionDate,
        batchNumber: dore.reception.batchNumber,
        observation: dore.reception.observation,
        cityId: dore.reception.cityId,
        miningTitleId: dore.reception.miningTitleId,
        isActive: dore.reception.isActive,
        createdAt: dore.reception.createdAt,
        updatedAt: dore.reception.updatedAt,
        company: dore.reception.company,
        supplier: dore.reception.supplier,
        receptionType: dore.reception.receptionType,
        receptionOrigin: dore.reception.receptionOrigin,
        dores: [
          {
            id: dore.id,
            code: dore.code,
            receivedWeight: dore.receivedWeight,
            observation: dore.observation,
            base64: dore.base64,
            format: dore.format,
          },
        ],
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al actualizar la recepción de doré: ${error.message}`,
      );
    }
  }
}
