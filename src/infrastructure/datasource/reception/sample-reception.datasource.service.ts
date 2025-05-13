import { PrismaService } from '@core/prisma/prisma.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IReceptionEntity,
  ISampleEntity,
} from '@domain/entities/reception/reception.entity';
import { IReceptionResponse } from '@domain/interfaces/reception';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier/supplier.datasource.service';
import { ReceptionTypeDataSourceService } from './reception-type.datasource.service';
import { ReceptionOriginDataSourceService } from './reception-origin.datasource.service';
import { StatusDataSourceService } from '@infrastructure/datasource/status';
import { UpdateSampleFilter } from '@domain/repositories/reception/sample-reception.repository';
import { Sample } from '@prisma/client';
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
      await this.supplierDataSource.findById(reception.supplierId);
      await this.companyDataSource.findById(reception.companyId);
      const receptionType =
        await this.receptionTypeDataSource.findByName('Muestra');
      const receptionTypeId = receptionType.id;

      const receivedStatus = await this.statusDataSource.findByName('RECIBIDO');

      const { samples, ...receptionData } = reception;

      const validatedSamples = [];

      for (const sample of samples) {
        await this.receptionOriginDataSource.findById(sample.receptionOriginId);
        validatedSamples.push(sample);
      }

      const receptionOriginId = samples[0].receptionOriginId;

      const lastSample = await this.prisma.sample.findFirst({
        orderBy: { code: 'desc' },
      });
      const baseCode = lastSample ? lastSample.code + 1 : 1;

      const sampleCreates = validatedSamples.map((sample, index) => {
        const sample_code = baseCode + index;

        return {
          receptionOrigin: {
            connect: {
              id: sample.receptionOriginId,
            },
          },
          receivedWeight: sample.receivedWeight,
          code: sample_code,
          status: {
            connect: {
              id: receivedStatus.id,
            },
          },
        };
      });

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
          samples: {
            create: sampleCreates,
          },
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
          samples: {
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

      // Crear los required analysis de cada Muestra
      for (let i = 0; i < createdReception.samples.length; i++) {
        const sample = createdReception.samples[i];
        const originalSample = samples[i];

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
        await this.companyDataSource.findById(companyId);
        where.companyId = companyId;
      }

      if (supplierId) {
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
          samples: {
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
      await this.companyDataSource.findById(companyId);

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

      const reception = await this.prisma.reception.findUnique({
        where: { id },
        include: {
          company: true,
          supplier: true,
          receptionType: true,
          samples: {
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
      const receptionExists = await this.prisma.reception.findUnique({
        where: { id },
      });

      if (!receptionExists) {
        throw new NotFoundException(`No se encontró la recepción con ID ${id}`);
      }

      if (reception.companyId) {
        await this.companyDataSource.findById(reception.companyId);
      }

      if (reception.supplierId) {
        await this.supplierDataSource.findById(reception.supplierId);
      }

      const receivedStatus = await this.statusDataSource.findByName('RECIBIDO');

      const {
        samples,
        companyId,
        supplierId,
        miningTitleId,
        cityId,
        ...otherFields
      } = reception;

      const { analysisTypeIds, receivedWeight, ...receptionData } =
        otherFields as any;

      const updateData: any = { ...receptionData };

      if (companyId) {
        updateData.company = {
          connect: { id: companyId },
        };
      }

      if (supplierId) {
        updateData.supplier = {
          connect: { id: supplierId },
        };
      }

      if (miningTitleId) {
        updateData.miningTitle = {
          connect: { id: miningTitleId },
        };
      }

      if (cityId) {
        updateData.city = {
          connect: { id: cityId },
        };
      }

      const updatedReception = await this.prisma.reception.update({
        where: { id },
        data: updateData,
        include: {
          company: true,
          supplier: true,
          receptionType: true,
          receptionOrigin: true,
          samples: {
            include: {
              receptionOrigin: true,
            },
          },
        },
      });

      if (samples && samples.length > 0) {
        await this.prisma.sample.deleteMany({
          where: { receptionId: id },
        });

        // Obtenemos el siguiente código base para las muestras
        const lastSample = await this.prisma.sample.findFirst({
          orderBy: { code: 'desc' },
        });
        const baseCode = lastSample ? lastSample.code + 1 : 1;

        // Luego creamos las nuevas
        for (let i = 0; i < samples.length; i++) {
          const unit = samples[i];
          await this.prisma.sample.create({
            data: {
              receptionId: id,
              receptionOriginId: unit.receptionOriginId,
              receivedWeight: unit.receivedWeight,
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
            samples: {
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

  async findSampleById(id: string): Promise<Sample> {
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

  async updateSamplesByFilter(
    filter: UpdateSampleFilter,
    updateData: Partial<IReceptionEntity>,
  ): Promise<IReceptionResponse[]> {
    try {
      const { companyId, supplierId, analysisTypeIds, receivedWeight } = filter;

      // Validar los parámetros del filtro
      if (companyId) {
        await this.companyDataSource.findById(companyId);
      }

      if (supplierId) {
        await this.supplierDataSource.findById(supplierId);
      }

      // Construir la consulta para encontrar recepciones que coincidan con los criterios
      let where: any = { isActive: true };

      if (companyId) {
        where.companyId = companyId;
      }

      if (supplierId) {
        where.supplierId = supplierId;
      }

      // Primero encontramos las recepciones que coinciden con los criterios
      const receptions = await this.prisma.reception.findMany({
        where,
        include: {
          samples: {
            include: {
              requiredAnalyses: true,
              receptionOrigin: true,
            },
          },
        },
      });

      if (receptions.length === 0) {
        throw new NotFoundException(
          'No se encontraron recepciones que coincidan con los criterios de búsqueda',
        );
      }

      // Filtrar las muestras que coinciden con los criterios adicionales
      const filteredReceptionIds: string[] = [];

      for (const reception of receptions) {
        let matched = false;

        // Filtrar por tipo de análisis si se especificó
        if (analysisTypeIds && analysisTypeIds.length > 0) {
          for (const sample of reception.samples) {
            // Verificar si la muestra tiene algún análisis requerido que coincida con los tipos especificados
            const matchingAnalyses = sample.requiredAnalyses.filter(
              (analysis) => analysisTypeIds.includes(analysis.analysisTypeId),
            );

            if (matchingAnalyses.length > 0) {
              matched = true;
              break;
            }
          }
        } else {
          matched = true; // No hay filtro de tipo de análisis, todas coinciden
        }

        // Filtrar por peso si se especificó
        if (matched && (receivedWeight !== undefined) !== undefined) {
          matched = false; // Resetear para verificar peso

          for (const sample of reception.samples) {
            let weightMatched = true;

            if (
              receivedWeight !== undefined &&
              Number(sample.receivedWeight) !== receivedWeight
            ) {
              weightMatched = false;
            }

            if (weightMatched) {
              matched = true;
              break;
            }
          }
        }

        if (matched) {
          filteredReceptionIds.push(reception.id);
        }
      }

      if (filteredReceptionIds.length === 0) {
        throw new NotFoundException(
          'No se encontraron muestras que coincidan con los criterios de búsqueda',
        );
      }

      const updatedReceptions: IReceptionResponse[] = [];

      for (const id of filteredReceptionIds) {
        const updatePayload: Partial<IReceptionEntity> = {};

        if (updateData.observation !== undefined) {
          updatePayload.observation = updateData.observation;
        }

        if (updateData.batchNumber !== undefined) {
          updatePayload.batchNumber = updateData.batchNumber;
        }

        const updatedReception = await this.updateReception(id, updatePayload);
        updatedReceptions.push(updatedReception);
      }

      return updatedReceptions;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al actualizar las muestras: ${errorMessage}`,
      );
    }
  }
  async findById(id: string): Promise<ISampleEntity> {
    const sample = await this.prisma.sample.findUnique({
      where: { id },
    });
    if (!sample) {
      throw new NotFoundException(`No se encontró la muestra con ID ${id}`);
    }
    return {
      code: sample.code,
      receivedWeight: Number(sample.receivedWeight),
      receptionOriginId: sample.receptionOriginId,
    };
  }
}
