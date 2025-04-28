import { Injectable, Inject } from '@nestjs/common';
import {
  CatalogTypeEnum,
  DocumentTypeEntity,
  SupplierEntity,
  ReceptionTypeEntity,
  AnalysisTypeEntity,
  CityEntity,
  DepartmentEntity,
  DoreReceptionTypeEntity,
} from '@domain/entities/catalog/catalog.entity';
import { ICatalogReadRepository } from '@domain/repositories/catalog';

@Injectable()
export class GetCatalogsUseCase {
  constructor(
    @Inject('ICatalogReadRepository')
    private readonly catalogRepository: ICatalogReadRepository,
  ) {}

  /**
   * Obtiene elementos de catálogo según su tipo
   */
  async execute<
    T extends
      | DocumentTypeEntity
      | SupplierEntity
      | ReceptionTypeEntity
      | AnalysisTypeEntity
      | CityEntity
      | DepartmentEntity
      | DoreReceptionTypeEntity,
  >(catalogType: CatalogTypeEnum): Promise<T[]> {
    return this.catalogRepository.getByType<T>(catalogType);
  }
}
