import { Injectable } from '@nestjs/common';
import { ISupplierEntity } from '@domain/entities/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';
import { SupplierRepository } from '@domain/repositories/supplier';
import { ShortNameGeneratorService } from '@infrastructure/services/supplier/shortname-generator.service';

@Injectable()
export class CreateSupplierUseCase {
  constructor(
    private readonly supplierRepository: SupplierRepository,
    private readonly shortNameGeneratorService: ShortNameGeneratorService,
  ) {}

  async execute(
    supplierData: ISupplierEntity,
    userId?: string,
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

    return this.supplierRepository.createSupplier(supplierData);
  }
}
