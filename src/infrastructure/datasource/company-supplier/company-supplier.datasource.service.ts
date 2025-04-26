import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { ISuppliersAssignmentResult } from '@domain/interfaces/company-supplier';

@Injectable()
export class CompanySupplierDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async assignSuppliers(
    companyId: string,
    supplierIds: string[],
  ): Promise<ISuppliersAssignmentResult> {
    const result: ISuppliersAssignmentResult = {
      successful: [],
      failed: [],
      allFailed: true,
    };

    // Procesar cada proveedor individualmente
    for (const supplierId of supplierIds) {
      try {
        // Verificar si ya existe la relación
        const existingCompanySupplier =
          await this.prisma.companySupplier.findFirst({
            where: {
              companyId,
              supplierId,
              isActive: true,
            },
          });

        if (existingCompanySupplier) {
          result.failed.push({
            supplierId,
            reason: 'El proveedor ya está asignado a la empresa',
          });
          continue;
        }

        // Crear la relación
        await this.prisma.companySupplier.create({
          data: {
            companyId,
            supplierId,
          },
        });

        result.successful.push({
          supplierId,
          success: true,
        });
      } catch (error: any) {
        result.failed.push({
          supplierId,
          reason: error.message || 'Error desconocido al asignar proveedor',
        });
      }
    }

    // Actualizar la bandera allFailed
    result.allFailed = result.successful.length === 0;

    return result;
  }

  async getCompanySuppliers(companyId: string) {
    return this.prisma.companySupplier.findMany({
      where: { companyId },
      include: {
        company: true,
        supplier: true,
      },
    });
  }
}
