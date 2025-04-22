import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { ISupplierEntity } from '@domain/entities/supplier';
import { Prisma } from '@prisma/client';

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
  async createSupplier(supplierData: ISupplierEntity) {
    try {
      return await this.prisma.supplier.create({
        data: {
          name: supplierData.name,
          documentType: supplierData.documentType,
          documentNumber: supplierData.documentNumber,
          isActive: supplierData.isActive ?? true,
          createdBy: supplierData.createdBy,
          updatedBy: supplierData.updatedBy,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Error de unique constraint (P2002)
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Ya existe un proveedor con el mismo documento y nombre',
          );
        }
      }
      throw error;
    }
  }
}
