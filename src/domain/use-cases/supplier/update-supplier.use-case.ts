import { Injectable } from '@nestjs/common';
import { ISupplierEntity } from '@domain/entities/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';
import { SupplierRepository } from '@domain/repositories/supplier';
import { ShortNameGeneratorService } from '@infrastructure/services/supplier/shortname-generator.service';

@Injectable()
export class UpdateSupplierUseCase {
  constructor(
    private readonly supplierRepository: SupplierRepository,
    private readonly shortNameGeneratorService: ShortNameGeneratorService,
  ) {}

  async execute(
    id: string,
    supplierData: Partial<ISupplierEntity>,
    userId?: string,
  ): Promise<ISupplierResponse> {
    // Asignamos el usuario que actualiza si se proporciona
    if (userId) {
      supplierData.updatedBy = userId;
    }

    // Si se está actualizando el nombre o documento, regenerar el shortName
    if (supplierData.name || supplierData.documentNumber) {
      // Obtener el proveedor actual para tener la información completa
      const currentSupplier = await this.supplierRepository.findByParams({
        id,
      });

      // Usar el nombre y documento actualizados o los existentes
      const name = supplierData.name || currentSupplier.name;
      const documentNumber =
        supplierData.documentNumber || currentSupplier.documentNumber;

      // Generar el nuevo shortName
      supplierData.shortName = this.shortNameGeneratorService.generate(
        name,
        documentNumber,
      );
    }

    return this.supplierRepository.update(id, supplierData);
  }
}
