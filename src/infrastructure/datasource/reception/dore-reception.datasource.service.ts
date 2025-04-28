import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { IDoreReceptionEntity } from '@domain/entities/reception';

@Injectable()
export class DoreReceptionDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea una nueva recepción de doré
   * @param reception Datos de la recepción
   * @returns La recepción creada con sus items
   */
  async createDoreReception(reception: IDoreReceptionEntity): Promise<any> {
    if (!reception) {
      throw new BadRequestException('Los datos de recepción son requeridos');
    }

    if (!reception.companyId) {
      throw new BadRequestException('La compañía es requerida');
    }

    if (!reception.supplierId) {
      throw new BadRequestException('El proveedor es requerido');
    }

    if (!reception.receptionTypeId) {
      throw new BadRequestException('El tipo de recepción es requerido');
    }

    if (!reception.receptionOriginId) {
      throw new BadRequestException('El origen de recepción es requerido');
    }

    if (!reception.items || reception.items.length === 0) {
      throw new BadRequestException(
        'Se requiere al menos un ítem de doré para la recepción',
      );
    }

    try {
      // Verificar que el proveedor existe
      const supplier = await this.prisma.supplier.findUnique({
        where: { id: reception.supplierId },
        select: { id: true, shortName: true },
      });

      if (!supplier) {
        throw new NotFoundException(
          `No se encontró el proveedor con ID ${reception.supplierId}`,
        );
      }

      // Verificar que la compañía existe
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

      // Verificar que el origen de recepción existe
      const receptionOriginExists =
        await this.prisma.receptionOrigin.findUnique({
          where: { id: reception.receptionOriginId },
        });

      if (!receptionOriginExists) {
        throw new NotFoundException(
          `No se encontró el origen de recepción con ID ${reception.receptionOriginId}`,
        );
      }

      // Obtener el estado "RECIBIDO"
      const receivedStatus = await this.prisma.status.findUnique({
        where: { name: 'RECIBIDO' },
      });

      if (!receivedStatus) {
        throw new NotFoundException('No se encontró el estado "RECIBIDO"');
      }

      // Creamos primero la recepción
      const createdReception = await this.prisma.reception.create({
        data: {
          companyId: reception.companyId,
          supplierId: reception.supplierId,
          receptionTypeId: reception.receptionTypeId,
          receptionOriginId: reception.receptionOriginId,
          receptionDate: reception.receptionDate || new Date(),
          batchNumber: reception.batchNumber,
          observation: reception.observation,
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

      // Creamos los ítems de doré asociados a la recepción
      const dores = [];
      for (const item of reception.items) {
        const dore = await this.prisma.dore.create({
          data: {
            receivedWeight: item.receivedWeight,
            observation: item.observation,
            statusId: receivedStatus.id,
            code: Math.floor(Math.random() * 1000000),
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

        // Solo incluimos receivedWeight y observation
        dores.push({
          receivedWeight: dore.receivedWeight,
          observation: dore.observation,
        });
      }

      // Devolvemos la recepción con los dorés
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
   * Obtiene las recepciones de doré
   * @param companyId ID de la compañía
   * @param supplierId ID del proveedor (opcional)
   * @returns Lista de recepciones
   */
  async getDoreReceptions(
    companyId?: string,
    supplierId?: string,
  ): Promise<any[]> {
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
        },
      });

      // Para cada recepción, buscamos sus dorés asociados (esto es una simulación, se debe ajustar)
      const receptionsWithDores = [];
      for (const reception of receptions) {
        // Aquí habría que implementar la lógica para asociar dorés a recepciones
        // Por ahora, simplemente devolvemos las recepciones con items simplificados
        receptionsWithDores.push({
          ...reception,
          batchNumber: reception.batchNumber || undefined,
          observation: reception.observation || undefined,
          dores: [
            {
              receivedWeight: 0,
              observation: 'Item de ejemplo (simplificado)',
            },
          ], // Items simplificados
        });
      }

      return receptionsWithDores;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al obtener las recepciones de doré: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene una recepción de doré por ID
   * @param id ID de la recepción
   * @param companyId ID de la compañía
   * @returns La recepción encontrada o null
   */
  async getDoreReceptionById(id: string, companyId: string): Promise<any> {
    if (!id) {
      throw new BadRequestException('El ID de la recepción es requerido');
    }

    if (!companyId) {
      throw new BadRequestException('El ID de la compañía es requerido');
    }

    try {
      // Verificamos si la recepción existe y pertenece a la compañía del usuario
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

      // Obtenemos la recepción completa
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

      if (!reception) {
        throw new NotFoundException('Recepción no encontrada');
      }

      // Aquí habría que implementar la lógica para asociar dorés a la recepción
      // Por ahora, simplemente devolvemos la recepción con items simplificados
      return {
        ...reception,
        batchNumber: reception.batchNumber || undefined,
        observation: reception.observation || undefined,
        dores: [
          {
            receivedWeight: 0,
            observation: 'Item de ejemplo (simplificado)',
          },
        ], // Items simplificados
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al obtener la recepción de doré: ${error.message}`,
      );
    }
  }
}
