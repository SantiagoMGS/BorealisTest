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
import { IPaginationOptions } from '@shared/interfaces/pagination.interfaces';
import {
  SupplierSelected,
  SupplierWithDocumentType,
} from './supplier.datasource.types';

@Injectable()
export class SupplierDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async createSupplier(
    supplierData: ISupplierEntity,
  ): Promise<SupplierWithDocumentType> {
    try {
      // Verificar si existe el tipo de documento
      const documentType = await this.prisma.documentType.findUnique({
        where: { id: supplierData.documentTypeId },
      });

      if (!documentType) {
        throw new NotFoundException('Tipo de documento no encontrado');
      }

      const supplier = await this.prisma.supplier.create({
        data: {
          ...supplierData,
          shortName: supplierData.shortName!,
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

  async findAll(
    options: IPaginationOptions,
  ): Promise<SupplierWithDocumentType[]> {
    const { page, limit, withDeleted } = options;

    const skip = (page - 1) * limit;

    const suppliers = await this.prisma.supplier.findMany({
      where: { isActive: withDeleted ? true : false },
      include: {
        documentType: true,
      },
      skip,
      take: limit,
      orderBy: {
        name: 'asc',
      },
    });

    return suppliers;
  }

  async findByParams(params: {
    id?: string;
    documentNumber?: string;
  }): Promise<SupplierSelected> {
    let where: Prisma.SupplierWhereInput = { isActive: true };

    if (params.id) {
      where.id = params.id;
    } else if (params.documentNumber) {
      where.documentNumber = params.documentNumber;
    }

    const supplier = await this.prisma.supplier.findFirst({
      where,
      select: {
        id: true,
        name: true,
        documentNumber: true,
        shortName: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        documentType: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return supplier;
  }

  async updateSupplier(
    id: string,
    supplierData: Partial<ISupplierEntity>,
  ): Promise<SupplierWithDocumentType> {
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
        include: {
          documentType: true,
        },
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
  ): Promise<SupplierWithDocumentType> {
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
      include: {
        documentType: true,
      },
    });

    return deletedSupplier;
  }

  async findById(id: string): Promise<SupplierWithDocumentType> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        documentType: true,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return supplier;
  }
}
