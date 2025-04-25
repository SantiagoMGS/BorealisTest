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
    const createdReception = await this.prisma.reception.create({
      data: {
        ...reception,
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
        company: true,
        supplier: true,
        receptionType: true,
        receptionOrigin: true,
        receptionUnits: {
          include: {
            receptionOrigin: true,
            subSamples: {
              include: {
                subSampleType: true,
                analyses: {
                  include: {
                    analysisType: true,
                  },
                },
              },
            },
            barrenado: true,
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

  async getReceptionById(id: string): Promise<IReceptionResponse> {
    console.log(id);

    // Primero verificamos si la recepción existe sin aplicar filtros para detectar el caso específico
    const receptionExists = await this.prisma.reception.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!receptionExists) {
      throw new Error('Recepción no encontrada');
    }

    // Si existe, obtenemos todos los datos
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
      },
    });

    // Si no se encontró con los filtros aplicados, es porque la recepción no pertenece a la compañía del usuario
    if (!reception) {
      throw new Error('No tienes acceso a esta recepción');
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
    const updatedReception = await this.prisma.reception.update({
      where: { id },
      data: {
        ...reception,
      },
    });

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
