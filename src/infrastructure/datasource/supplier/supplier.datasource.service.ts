import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { ISupplierEntity } from '@domain/entities/supplier';
import { Prisma } from '@prisma/client';
import { ISupplierResponse } from '@domain/interfaces/supplier';

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
      const supplier = await this.prisma.supplier.create({
        data: supplierData,
      });
      return supplier;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 es el código de error que Prisma devuelve cuando hay una violación de una restricción única
        // En este caso, significa que ya existe un registro con el mismo número de documento
        if (error.code === 'P2002') {
          throw new ConflictException('El número de documento ya existe');
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<ISupplierResponse[]> {
    return await this.prisma.supplier.findMany({
      where: { isActive: true },
    });
  }

  async findByParams(params: {
    id?: string;
    documentNumber?: string;
  }): Promise<ISupplierResponse> {
    let supplier: ISupplierResponse | null = null;

    if (params.id) {
      // Validar que el ID tenga el formato correcto de UUID
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(params.id)) {
        throw new NotFoundException('ID de proveedor inválido');
      }

      supplier = await this.prisma.supplier.findUnique({
        where: { id: params.id },
      });
    } else if (params.documentNumber) {
      supplier = await this.prisma.supplier.findFirst({
        where: { documentNumber: params.documentNumber },
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
    supplier: Partial<ISupplierEntity>,
  ): Promise<ISupplierResponse> {
    return await this.prisma.supplier.update({
      where: { id },
      data: supplier,
    });
  }

  async deleteSupplier(
    id: string,
    userId?: string,
  ): Promise<ISupplierResponse> {
    const supplier = await this.findByParams({ id });
    if (!supplier.isActive) {
      throw new NotFoundException('Proveedor inactivo');
    }
    return await this.prisma.supplier.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });
  }
}
