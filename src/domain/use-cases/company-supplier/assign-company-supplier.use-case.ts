import { Injectable } from '@nestjs/common';
import { ICompanySupplierRepository } from '@domain/repositories/company-supplier/company-supplier.repository';
import { ICompanyRepository } from '@domain/repositories/company/company.repository';
import { SupplierRepository } from '@domain/repositories/supplier/supplier.repository';
import { AssignSuppliersDto } from '@presentation/controllers/company/dtos';

@Injectable()
export class AssignCompanySupplierUseCase {
  constructor(
    private readonly companySupplierRepository: ICompanySupplierRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly supplierRepository: SupplierRepository,
  ) {}

  async execute(assignSuppliersDto: AssignSuppliersDto): Promise<void> {
    const { companyId, supplierIds } = assignSuppliersDto;

    // Verificar que la compañía existe
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new Error('Compañía no encontrada');
    }

    // Verificar que todos los proveedores existen
    for (const supplierId of supplierIds) {
      const supplier = await this.supplierRepository.findById(supplierId);
      if (!supplier) {
        throw new Error(`Proveedor con ID ${supplierId} no encontrado`);
      }
    }

    // Asignar los proveedores a la compañía
    await this.companySupplierRepository.assignSuppliers(
      companyId,
      supplierIds,
    );
  }
}
