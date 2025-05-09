import {
  Injectable,
  ConflictException,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { ISupplierEntity } from '@domain/entities/supplier';
import { Prisma, Supplier } from '@prisma/client';
import {
  ISupplierResponse,
  IMiningTitleResponse,
} from '@domain/interfaces/supplier';
import { MiningTitlePersistenceMapper } from './mappers/mining-title.mapper';

@Injectable()
export class SupplierDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un nuevo proveedor en la base de datos
   *
   * @param supplierData Datos del proveedor a crear
   * @returns El proveedor creado
   * @throws ConflictException si ya existe un proveedor con el mismo documento y nombre
   */
  async createSupplier(
    supplierData: ISupplierEntity,
  ): Promise<ISupplierResponse> {
    try {
      // Verificar si existe el tipo de documento
      const documentType = await this.prisma.documentType.findUnique({
        where: { id: supplierData.documentTypeId },
      });

      if (!documentType) {
        throw new NotFoundException('Tipo de documento no encontrado');
      }

      if (!supplierData.shortName) {
        throw new BadRequestException(
          'El nombre corto del proveedor es requerido',
        );
      }

      const supplier = await this.prisma.supplier.create({
        data: {
          ...supplierData,
          shortName: supplierData.shortName,
        },
        include: {
          documentType: true,
        },
      });

      return supplier;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // P2002 es el código para violación de restricción unique
          // Verificar qué campo causó el conflicto
          const target = (error.meta?.target as string[]) || [];

          if (target.includes('documentNumber')) {
            throw new ConflictException('El número de documento ya existe');
          } else if (target.includes('shortName')) {
            throw new ConflictException(
              'El nombre corto del proveedor ya existe',
            );
          } else {
            throw new ConflictException(
              'Ya existe un registro con los datos proporcionados',
            );
          }
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Tipo de documento no encontrado');
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<ISupplierResponse[]> {
    const suppliers = await this.prisma.supplier.findMany({
      where: { isActive: true },
      include: {
        documentType: true, // Incluir los datos del tipo de documento
      },
    });

    return suppliers;
  }

  async findByParams(params: {
    id?: string;
    documentNumber?: string;
  }): Promise<ISupplierResponse> {
    let supplier: Supplier | null = null;

    if (params.id) {
      supplier = await this.prisma.supplier.findUnique({
        where: { id: params.id },
        include: {
          documentType: true, // Incluir los datos del tipo de documento
        },
      });
    } else if (params.documentNumber) {
      supplier = await this.prisma.supplier.findFirst({
        where: { documentNumber: params.documentNumber },
        include: {
          documentType: true, // Incluir los datos del tipo de documento
        },
      });
    }

    if (!supplier) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    if (!supplier.isActive) {
      throw new NotFoundException('Proveedor inactivo');
    }

    return supplier;
  }

  async updateSupplier(
    id: string,
    supplierData: Partial<ISupplierEntity>,
  ): Promise<ISupplierResponse> {
    try {
      // Primero verificar si existe el proveedor
      const existingSupplier = await this.prisma.supplier.findUnique({
        where: { id },
      });

      if (!existingSupplier) {
        throw new NotFoundException('Proveedor no encontrado');
      }

      if (!existingSupplier.isActive) {
        throw new NotFoundException('Proveedor inactivo');
      }

      // Si se está actualizando el documentNumber, verificar que no exista otro con el mismo número
      if (supplierData.documentNumber) {
        const supplierWithSameDocument = await this.prisma.supplier.findFirst({
          where: {
            documentNumber: supplierData.documentNumber,
            id: { not: id },
            isActive: true,
          },
        });

        if (supplierWithSameDocument) {
          throw new ConflictException(
            'Ya existe un proveedor con este número de documento',
          );
        }
      }

      const updatedSupplier = await this.prisma.supplier.update({
        where: { id },
        data: supplierData,
      });

      return updatedSupplier;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Proveedor no encontrado');
        }
        if (error.code === 'P2002') {
          // Verificar qué campo causó el conflicto
          const target = (error.meta?.target as string[]) || [];

          if (target.includes('documentNumber')) {
            throw new ConflictException('El número de documento ya existe');
          } else if (target.includes('shortName')) {
            throw new ConflictException(
              'El nombre corto del proveedor ya existe',
            );
          } else {
            throw new ConflictException(
              'Ya existe un registro con los datos proporcionados',
            );
          }
        }
      }
      throw error;
    }
  }

  async deleteSupplier(
    id: string,
    userId?: string,
  ): Promise<ISupplierResponse> {
    const supplier = await this.findByParams({ id });
    if (!supplier.isActive) {
      throw new NotFoundException('Proveedor inactivo');
    }

    const deletedSupplier = await this.prisma.supplier.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });

    return deletedSupplier;
  }

  async findById(id: string): Promise<ISupplierResponse> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        documentType: true,
        supplierMiningTitles: {
          include: {
            mineType: true,
            city: {
              include: {
                department: true,
              },
            },
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return supplier;
  }

  async findMiningTitles(supplierId: string): Promise<IMiningTitleResponse[]> {
    await this.findById(supplierId);

    const miningTitles = await this.prisma.supplierMiningTitle.findMany({
      where: { supplierId },
      include: {
        mineType: true,
        city: {
          include: {
            department: true,
          },
        },
      },
    });

    if (miningTitles.length === 0)
      throw new HttpException(
        'No se encontraron títulos mineros para este proveedor',
        HttpStatus.NO_CONTENT,
      );

    return MiningTitlePersistenceMapper.toDomainList(miningTitles);
  }

  async findMiningTitle(supplierId: string): Promise<IMiningTitleResponse> {
    // Este método puede mantenerse para compatibilidad o eliminarse
    const titles = await this.findMiningTitles(supplierId);
    return titles[0]; // Retorna el primer título encontrado
  }
}
