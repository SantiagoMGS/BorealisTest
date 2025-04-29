import { PrismaService } from '@core/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IReceptionEntity } from '@domain/entities/reception/reception.entity';
import { IReceptionResponse } from '@domain/interfaces/reception';

@Injectable()
export class SampleReceptionDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async createReception(
    reception: IReceptionEntity,
  ): Promise<IReceptionResponse> {
    // Validamos los datos de entrada
    if (!reception) {
      throw new BadRequestException('Los datos de la recepción son requeridos');
    }

    if (!reception.companyId) {
      throw new BadRequestException('El ID de la compañía es requerido');
    }

    if (!reception.supplierId) {
      throw new BadRequestException('El ID del proveedor es requerido');
    }

    if (!reception.receptionTypeId) {
      throw new BadRequestException('El ID del tipo de recepción es requerido');
    }

    if (!reception.receptionDate) {
      throw new BadRequestException('La fecha de recepción es requerida');
    }

    if (!reception.Samples || reception.Samples.length === 0) {
      throw new BadRequestException(
        'Se requiere al menos una muestra para la recepción',
      );
    }

    // Validamos cada muestra
    for (const sample of reception.Samples) {
      if (!sample.receptionOriginId) {
        throw new BadRequestException(
          'El ID del origen de recepción es requerido para cada muestra',
        );
      }

      if (sample.receivedWeight === undefined || sample.receivedWeight < 0) {
        throw new BadRequestException(
          'El peso recibido debe ser un número positivo',
        );
      }

      if (sample.dryWeight === undefined || sample.dryWeight < 0) {
        throw new BadRequestException(
          'El peso seco debe ser un número positivo',
        );
      }
    }

    try {
      // Verificar que el proveedor existe y obtener su shortName
      const supplier = await this.prisma.supplier.findUnique({
        where: { id: reception.supplierId },
        select: { id: true, shortName: true },
      });

      if (!supplier) {
        throw new NotFoundException(
          `No se encontró el proveedor con ID ${reception.supplierId}`,
        );
      }

      // Verificar que la compañía existe y obtener su shortName
      const company = await this.prisma.company.findUnique({
        where: { id: reception.companyId },
        select: { id: true, shortName: true },
      });

      if (!company) {
        throw new NotFoundException(
          `No se encontró la compañía con ID ${reception.companyId}`,
        );
      }

      // Verificar que el tipo de recepción existe
      const receptionTypeExists = await this.prisma.receptionType.findUnique({
        where: { id: reception.receptionTypeId },
      });

      if (!receptionTypeExists) {
        throw new NotFoundException(
          `No se encontró el tipo de recepción con ID ${reception.receptionTypeId}`,
        );
      }

      // Obtener el estado "RECIBIDO"
      const receivedStatus = await this.prisma.status.findUnique({
        where: { name: 'RECIBIDO' },
      });

      if (!receivedStatus) {
        throw new NotFoundException('No se encontró el estado "RECIBIDO"');
      }

      // Extraemos las unidades de recepción
      const { Samples, ...receptionData } = reception;

      // Validamos que los orígenes de recepción existan y obtenemos sus shortName
      const validatedSamples = [];
      for (const sample of Samples) {
        const origin = await this.prisma.receptionOrigin.findUnique({
          where: { id: sample.receptionOriginId },
          select: { id: true, shortName: true },
        });

        if (!origin) {
          throw new NotFoundException(
            `No se encontró el origen de recepción con ID ${sample.receptionOriginId}`,
          );
        }

        validatedSamples.push({
          ...sample,
          origin,
        });
      }

      // Usamos el primer origen como origen principal de la recepción
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
          receptionOriginId: sample.receptionOriginId,
          receivedWeight: sample.receivedWeight,
          dryWeight: sample.dryWeight,
          code: sample_code,
          statusId: receivedStatus.id, // Asignamos el estado "RECIBIDO"
        };
      });

      // Creamos la recepción con sus unidades de recepción asociadas
      const createdReception = await this.prisma.reception.create({
        data: {
          ...receptionData,
          receptionOriginId,
          Samples: {
            create: sampleCreates,
          },
        },
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

      return {
        ...createdReception,
        batchNumber: createdReception.batchNumber || undefined,
        observation: createdReception.observation || undefined,
      };
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error al crear la recepción: ${error.message}`,
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
        const companyExists = await this.prisma.company.findUnique({
          where: { id: companyId },
        });

        if (!companyExists) {
          throw new NotFoundException(
            `No se encontró la compañía con ID ${companyId}`,
          );
        }

        where.companyId = companyId;
      }

      if (supplierId) {
        // Verificar que el proveedor existe
        const supplierExists = await this.prisma.supplier.findUnique({
          where: { id: supplierId },
        });

        if (!supplierExists) {
          throw new NotFoundException(
            `No se encontró el proveedor con ID ${supplierId}`,
          );
        }

        where.supplierId = supplierId;
      }

      const receptions = await this.prisma.reception.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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
          Samples: {
            include: {
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

      return receptions.map((reception) => ({
        ...reception,
        batchNumber: reception.batchNumber || undefined,
        observation: reception.observation || undefined,
      }));
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al obtener las recepciones: ${error.message}`,
      );
    }
  }

  async getReceptionById(
    id: string,
    companyId: string,
  ): Promise<IReceptionResponse> {
    if (!id) {
      throw new BadRequestException('El ID de la recepción es requerido');
    }

    if (!companyId) {
      throw new BadRequestException('El ID de la compañía es requerido');
    }

    try {
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
          Samples: {
            include: {
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

      if (!reception) {
        throw new NotFoundException('Recepción no encontrada');
      }

      return {
        ...reception,
        batchNumber: reception.batchNumber || undefined,
        observation: reception.observation || undefined,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al obtener la recepción: ${error.message}`,
      );
    }
  }

  async updateReception(
    id: string,
    reception: Partial<IReceptionEntity>,
  ): Promise<IReceptionResponse> {
    if (!id) {
      throw new BadRequestException('El ID de la recepción es requerido');
    }

    if (!reception) {
      throw new BadRequestException('Los datos de la recepción son requeridos');
    }

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
        const companyExists = await this.prisma.company.findUnique({
          where: { id: reception.companyId },
        });

        if (!companyExists) {
          throw new NotFoundException(
            `No se encontró la compañía con ID ${reception.companyId}`,
          );
        }
      }

      if (reception.supplierId) {
        const supplierExists = await this.prisma.supplier.findUnique({
          where: { id: reception.supplierId },
        });

        if (!supplierExists) {
          throw new NotFoundException(
            `No se encontró el proveedor con ID ${reception.supplierId}`,
          );
        }
      }

      if (reception.receptionTypeId) {
        const receptionTypeExists = await this.prisma.receptionType.findUnique({
          where: { id: reception.receptionTypeId },
        });

        if (!receptionTypeExists) {
          throw new NotFoundException(
            `No se encontró el tipo de recepción con ID ${reception.receptionTypeId}`,
          );
        }
      }

      // Obtener el estado "RECIBIDO" para las nuevas muestras
      const receivedStatus = await this.prisma.status.findUnique({
        where: { name: 'RECIBIDO' },
      });

      if (!receivedStatus) {
        throw new NotFoundException('No se encontró el estado "RECIBIDO"');
      }

      // Si hay unidades de recepción para actualizar, las validamos
      const { Samples, ...receptionData } = reception;

      if (Samples && Samples.length > 0) {
        // Validamos cada muestra
        for (const sample of Samples) {
          if (!sample.receptionOriginId) {
            throw new BadRequestException(
              'El ID del origen de recepción es requerido para cada muestra',
            );
          }

          if (
            sample.receivedWeight === undefined ||
            sample.receivedWeight < 0
          ) {
            throw new BadRequestException(
              'El peso recibido debe ser un número positivo',
            );
          }

          if (sample.dryWeight === undefined || sample.dryWeight < 0) {
            throw new BadRequestException(
              'El peso seco debe ser un número positivo',
            );
          }

          // Verificar que el origen de recepción existe
          const originExists = await this.prisma.receptionOrigin.findUnique({
            where: { id: sample.receptionOriginId },
          });

          if (!originExists) {
            throw new NotFoundException(
              `No se encontró el origen de recepción con ID ${sample.receptionOriginId}`,
            );
          }
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
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error al actualizar la recepción: ${error.message}`,
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
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al eliminar la recepción: ${error.message}`,
      );
    }
  }
}
