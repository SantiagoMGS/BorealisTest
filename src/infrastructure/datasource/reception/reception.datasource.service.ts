import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IReceptionEntity } from '@domain/entities/reception/reception.entity';
import { IReceptionResponse } from '@domain/interfaces/reception';

@Injectable()
export class ReceptionDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async createReception(
    reception: IReceptionEntity,
  ): Promise<IReceptionResponse> {
    // Extraemos las unidades de recepción
    const { Samples, ...receptionData } = reception;

    // Usamos el primer origen como origen principal de la recepción
    // Esto es necesario porque el esquema de Prisma requiere un receptionOriginId
    const receptionOriginId = Samples[0].receptionOriginId;

    // Creamos la recepción con sus unidades de recepción asociadas
    const createdReception = await this.prisma.reception.create({
      data: {
        ...receptionData,
        receptionOriginId,
        Samples: {
          create: Samples,
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
  }

  async getReceptions(
    companyId?: string,
    supplierId?: string,
  ): Promise<IReceptionResponse[]> {
    const where: any = { isActive: true };

    if (companyId) {
      where.companyId = companyId;
    }

    if (supplierId) {
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
  }

  async getReceptionById(
    id: string,
    companyId: string,
  ): Promise<IReceptionResponse> {
    console.log(id);

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
      throw new Error('Recepción no encontrada o no tienes acceso a ella');
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
      throw new Error('Recepción no encontrada');
    }

    return {
      ...reception,
      batchNumber: reception.batchNumber || undefined,
      observation: reception.observation || undefined,
    };
  }

  async updateReception(
    id: string,
    reception: Partial<IReceptionEntity>,
  ): Promise<IReceptionResponse> {
    // Si hay unidades de recepción para actualizar, las manejamos por separado
    const { Samples, ...receptionData } = reception;

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

      // Luego creamos las nuevas
      for (const unit of Samples) {
        await this.prisma.sample.create({
          data: {
            ...unit,
            receptionId: id,
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
        throw new Error(`No se encontró la recepción con ID ${id}`);
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
  }

  async deleteReception(id: string): Promise<void> {
    await this.prisma.reception.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
