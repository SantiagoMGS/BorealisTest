import { BadRequestException, Injectable } from '@nestjs/common';
import { CompanyRepository } from '@domain/repositories/company/company.repository';
import { SupplierRepository } from '@domain/repositories/supplier/supplier.repository';
import { AssignSuppliersDto } from '@presentation/controllers/company/dtos';
import { ISuppliersAssignmentResult } from '@domain/interfaces/company-supplier';

@Injectable()
export class AssignCompanySupplierUseCase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly supplierRepository: SupplierRepository,
  ) {}

  async execute(
    assignSuppliersDto: AssignSuppliersDto,
    companyId: string,
  ): Promise<ISuppliersAssignmentResult> {
    const { supplierIds } = assignSuppliersDto;
    const result: ISuppliersAssignmentResult = {
      successful: [],
      failed: [],
      allFailed: true,
    };

    // Verificar que la compañía existe
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new BadRequestException('Compañía no encontrada');
    }

    // Procesar cada proveedor individualmente
    for (const supplierId of supplierIds) {
      try {
        // Verificar que el proveedor existe
        const supplier = await this.supplierRepository.findById(supplierId);
        if (!supplier) {
          result.failed.push({
            supplierId,
            reason: `Proveedor con ID ${supplierId} no encontrado`,
          });
          continue;
        }

        // Verificar si ya existe la relación utilizando el repositorio
        const existingRelations =
          await this.companyRepository.getCompanySuppliers(companyId);
        const alreadyExists = existingRelations.some(
          (relation) => relation.supplier.id === supplierId,
        );

        if (alreadyExists) {
          result.failed.push({
            supplierId,
            reason: 'El proveedor ya está asignado a la empresa',
          });
          continue;
        }

        // Intentar crear la relación para este proveedor
        await this.companyRepository.assignSuppliers(companyId, [supplierId]);

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

    // Si todos los proveedores fallaron, lanzar excepción
    if (result.allFailed) {
      throw new BadRequestException(
        'Ningún proveedor pudo ser asignado a la empresa',
      );
    }

    return result;
  }
}
