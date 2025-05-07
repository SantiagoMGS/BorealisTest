import { PrismaService } from '@core/prisma/prisma.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IReceptionEntity } from '@domain/entities/reception/reception.entity';
import { IReceptionResponse } from '@domain/interfaces/reception';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier/supplier.datasource.service';
import { ReceptionTypeDataSourceService } from './reception-type.datasource.service';
import { ReceptionOriginDataSourceService } from './reception-origin.datasource.service';
import { StatusDataSourceService } from '@infrastructure/datasource/status';

@Injectable()
export class SampleReceptionDataSourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companyDataSource: CompanyDataSourceService,
    private readonly supplierDataSource: SupplierDataSourceService,
    private readonly receptionTypeDataSource: ReceptionTypeDataSourceService,
    private readonly receptionOriginDataSource: ReceptionOriginDataSourceService,
    private readonly statusDataSource: StatusDataSourceService,
  ) {}

  async createReception(
    reception: IReceptionEntity,
  ): Promise<IReceptionResponse> {
    try {
      // Verificar que el proveedor existe y obtener su shortName
      await this.supplierDataSource.findById(reception.supplierId);
      console.log('supplier', reception.supplierId);

      // Verificar que la compañía existe
      await this.companyDataSource.findById(reception.companyId);
      console.log('company', reception.companyId);

      // Obtener el tipo de recepción "Muestras"
      const receptionType =
        await this.receptionTypeDataSource.findByName('Muestra');
      const receptionTypeId = receptionType.id;

      // Obtener el estado "RECIBIDO"
      const receivedStatus = await this.statusDataSource.findByName('RECIBIDO');

      // Extraemos las unidades de recepción
      const { Samples, ...receptionData } = reception;

      // Validamos que los orígenes de recepción existan
      const validatedSamples = [];

      for (const sample of Samples) {
        await this.receptionOriginDataSource.findById(sample.receptionOriginId);
        validatedSamples.push(sample);
      }

      // Usamos el primer origen como origen principal de la recepción (es requerido por el esquema)
      const receptionOriginId = Samples[0].receptionOriginId;

      // Obtenemos el siguiente código base para las muestras
      const lastSample = await this.prisma.sample.findFirst({
        orderBy: { code: 'desc' },
      });
      const baseCode = lastSample ? lastSample.code + 1 : 1;

      // Preparamos las muestras con sus códigos y el estado "RECIBIDO"
      const sampleCreates = validatedSamples.map((sample, index) => {
        // Creamos el código para la muestra
        const sample_code = baseCode + index;

        return {
          receptionOrigin: {
            connect: {
              id: sample.receptionOriginId,
            },
          },
          receivedWeight: sample.receivedWeight,
          dryWeight: sample.dryWeight,
          code: sample_code,
          status: {
            connect: {
              id: receivedStatus.id,
            },
          },
        };
      });

      // Creamos la recepción con sus unidades de recepción asociadas
      const createdReception = await this.prisma.reception.create({
        data: {
          receptionDate: reception.receptionDate,
          batchNumber: reception.batchNumber,
          observation: reception.observation,
          isActive: true,
          company: {
            connect: {
              id: reception.companyId,
            },
          },
          supplier: {
            connect: {
              id: reception.supplierId,
            },
          },
          receptionOrigin: {
            connect: {
              id: receptionOriginId,
            },
          },
          receptionType: {
            connect: {
              id: receptionTypeId,
            },
          },
          Samples: {
            create: sampleCreates,
          },
          // Relaciones opcionales
          ...(reception.cityId
            ? {
                city: {
                  connect: {
                    id: reception.cityId,
                  },
                },
              }
            : {}),
          ...(reception.miningTitleId
            ? {
                miningTitle: {
                  connect: {
                    id: reception.miningTitleId,
                  },
                },
              }
            : {}),
        },
        include: {
          company: true,
          supplier: true,
          receptionType: true,
          Samples: {
            include: {
              receptionOrigin: true,
              requiredAnalyses: {
                include: {
                  analysisType: true,
                },
              },
            },
          },
        },
      });

      // Creamos los análisis requeridos para cada muestra
      for (let i = 0; i < createdReception.Samples.length; i++) {
        const sample = createdReception.Samples[i];
        const originalSample = Samples[i];

        // Crear los análisis requeridos y guardar sus referencias
        const requiredAnalyses = await Promise.all(
          originalSample.analysisTypeIds!.map((analysisTypeId) =>
            this.prisma.sampleRequiredAnalysis.create({
              data: {
                sampleId: sample.id,
                analysisTypeId: analysisTypeId,
                done: false,
              },
              include: {
                analysisType: true,
              },
            }),
          ),
        );

        // Asignar los análisis requeridos a cada muestra en la respuesta
        (sample as any).requiredAnalyses = requiredAnalyses;
      }

      return {
        ...createdReception,
        batchNumber: createdReception.batchNumber || undefined,
        observation: createdReception.observation || undefined,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al crear la recepción: ${errorMessage}`,
      );
    }
  }

  async getReceptions(
    companyId?: string,
    supplierId?: string,
  ): Promise<IReceptionResponse[]> {
    try {
      const where: any = { isActive: true };

      if (companyId) {
        // Verificar que la compañía existe
        await this.companyDataSource.findById(companyId);
        where.companyId = companyId;
      }

      if (supplierId) {
        // Verificar que el proveedor existe
        await this.supplierDataSource.findById(supplierId);
        where.supplierId = supplierId;
      }

      const receptions = await this.prisma.reception.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          company: true,
          supplier: true,
          receptionType: true,
          Samples: {
            include: {
              receptionOrigin: true,
              requiredAnalyses: {
                include: {
                  analysisType: true,
                },
              },
            },
          },
        },
      });

      if (receptions.length === 0)
        throw new HttpException(
          'No se encontraron recepciones para este origen de recepción',
          HttpStatus.NO_CONTENT,
        );

      return receptions.map((reception) => ({
        ...reception,
        batchNumber: reception.batchNumber || undefined,
        observation: reception.observation || undefined,
      }));
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al obtener las recepciones: ${errorMessage}`,
      );
    }
  }

  async getReceptionById(
    id: string,
    companyId: string,
  ): Promise<IReceptionResponse> {
    try {
      // Verificar que la compañía existe
      await this.companyDataSource.findById(companyId);

      // Primero verificamos si la recepción existe y pertenece a la compañía del usuario
      const receptionExists = await this.prisma.reception.findFirst({
        where: {
          id,
          companyId,
          isActive: true,
        },
        select: { id: true },
      });

      if (!receptionExists) {
        throw new NotFoundException(
          'Recepción no encontrada o no tienes acceso a ella',
        );
      }

      // Si existe y pertenece a la compañía, obtenemos todos los datos
      const reception = await this.prisma.reception.findUnique({
        where: { id },
        include: {
          company: true,
          supplier: true,
          receptionType: true,
          Samples: {
            include: {
              receptionOrigin: true,
              requiredAnalyses: {
                include: {
                  analysisType: true,
                },
              },
            },
          },
        },
      });

      if (!reception) {
        throw new NotFoundException('Recepción no encontrada');
      }

      return {
        ...reception,
        batchNumber: reception.batchNumber || undefined,
        observation: reception.observation || undefined,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al obtener la recepción: ${errorMessage}`,
      );
    }
  }

  async updateReception(
    id: string,
    reception: Partial<IReceptionEntity>,
  ): Promise<IReceptionResponse> {
    try {
      // Verificar que la recepción existe
      const receptionExists = await this.prisma.reception.findUnique({
        where: { id },
      });

      if (!receptionExists) {
        throw new NotFoundException(`No se encontró la recepción con ID ${id}`);
      }

      // Validar las relaciones si se van a actualizar
      if (reception.companyId) {
        await this.companyDataSource.findById(reception.companyId);
      }

      if (reception.supplierId) {
        await this.supplierDataSource.findById(reception.supplierId);
      }

      // Obtener el estado "RECIBIDO" para las nuevas muestras
      const receivedStatus = await this.statusDataSource.findByName('RECIBIDO');

      // Si hay unidades de recepción para actualizar, las validamos
      const { Samples, ...receptionData } = reception;

      if (Samples && Samples.length > 0) {
        // Validamos que los orígenes de recepción existan
        for (const sample of Samples) {
          await this.receptionOriginDataSource.findById(
            sample.receptionOriginId,
          );
        }
      }

      // Actualizamos solo los datos de la recepción principal
      const updatedReception = await this.prisma.reception.update({
        where: { id },
        data: receptionData,
        include: {
          company: true,
          supplier: true,
          receptionType: true,
          receptionOrigin: true,
          Samples: {
            include: {
              receptionOrigin: true,
            },
          },
        },
      });

      // Si hay unidades nuevas, las procesamos
      if (Samples && Samples.length > 0) {
        // Primero eliminamos las unidades existentes
        await this.prisma.sample.deleteMany({
          where: { receptionId: id },
        });

        // Obtenemos el siguiente código base para las muestras
        const lastSample = await this.prisma.sample.findFirst({
          orderBy: { code: 'desc' },
        });
        const baseCode = lastSample ? lastSample.code + 1 : 1;

        // Luego creamos las nuevas
        for (let i = 0; i < Samples.length; i++) {
          const unit = Samples[i];
          await this.prisma.sample.create({
            data: {
              receptionId: id,
              receptionOriginId: unit.receptionOriginId,
              receivedWeight: unit.receivedWeight,
              dryWeight: unit.dryWeight,
              code: baseCode + i,
              statusId: receivedStatus.id, // Todas las nuevas muestras inician con estado "RECIBIDO"
            },
          });
        }

        // Obtenemos la recepción actualizada con las nuevas unidades
        const refreshedReception = await this.prisma.reception.findUnique({
          where: { id },
          include: {
            company: true,
            supplier: true,
            receptionType: true,
            receptionOrigin: true,
            Samples: {
              include: {
                receptionOrigin: true,
              },
            },
          },
        });

        if (!refreshedReception) {
          throw new NotFoundException(
            `No se encontró la recepción con ID ${id}`,
          );
        }

        return {
          ...refreshedReception,
          batchNumber: refreshedReception.batchNumber || undefined,
          observation: refreshedReception.observation || undefined,
        };
      }

      return {
        ...updatedReception,
        batchNumber: updatedReception.batchNumber || undefined,
        observation: updatedReception.observation || undefined,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al actualizar la recepción: ${errorMessage}`,
      );
    }
  }

  async deleteReception(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('El ID de la recepción es requerido');
    }

    try {
      // Verificar que la recepción existe
      const receptionExists = await this.prisma.reception.findUnique({
        where: { id },
      });

      if (!receptionExists) {
        throw new NotFoundException(`No se encontró la recepción con ID ${id}`);
      }

      await this.prisma.reception.update({
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

  async findSampleById(id: string): Promise<any> {
    try {
      const sample = await this.prisma.sample.findUnique({
        where: { id },
        include: {
          reception: {
            include: {
              company: true,
              supplier: true,
              receptionType: true,
            },
          },
          receptionOrigin: true,
          status: true,
          requiredAnalyses: {
            include: {
              analysisType: true,
            },
          },
        },
      });

      if (!sample) {
        throw new NotFoundException(`No se encontró la muestra con ID ${id}`);
      }

      return sample;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al obtener la muestra: ${errorMessage}`,
      );
    }
  }
}
