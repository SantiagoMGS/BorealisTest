import { Injectable } from '@nestjs/common';
import { ISupplierEntity } from '@domain/entities/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';
import { SupplierRepository } from '@domain/repositories/supplier';
import { ShortNameGeneratorService } from '@infrastructure/services/supplier/shortname-generator.service';
import { ICompanySupplierRepository } from '@domain/repositories/company-supplier/company-supplier.repository';
import { IAuthUser } from '@domain/entities/auth';

@Injectable()
export class CreateSupplierUseCase {
  constructor(
    private readonly supplierRepository: SupplierRepository,
    private readonly shortNameGeneratorService: ShortNameGeneratorService,
    private readonly companySupplierRepository: ICompanySupplierRepository,
  ) {}

  async execute(
    supplierData: ISupplierEntity,
    userId?: string,
    companyId?: string,
  ): Promise<ISupplierResponse> {
    // Asignamos el creador si se proporciona el ID del usuario
    if (userId) {
      supplierData.createdBy = userId;
      supplierData.updatedBy = userId;
    }

    // Generar automáticamente el shortName (reemplaza el valor que venga en el DTO)
    supplierData.shortName = this.shortNameGeneratorService.generate(
      supplierData.name,
      supplierData.documentNumber,
    );

    // Crear el proveedor
    const createdSupplier =
      await this.supplierRepository.createSupplier(supplierData);

    // Si se proporciona el ID de la compañía, asignar el proveedor a la compañía
    if (companyId) {
      await this.companySupplierRepository.assignSuppliers(companyId, [
        createdSupplier.id,
      ]);
    }

    return createdSupplier;
  }
}
