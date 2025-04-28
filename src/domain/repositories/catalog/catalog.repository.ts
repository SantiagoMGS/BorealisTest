import {
  CatalogTypeEnum,
  DocumentTypeEntity,
  SupplierEntity,
  ReceptionTypeEntity,
  ReceptionOriginEntity,
  AnalysisTypeEntity,
  CityEntity,
  DepartmentEntity,
} from '@domain/entities/catalog/catalog.entity';

/**
 * Interfaz para operaciones de lectura de catálogos
 */
export interface ICatalogReadRepository {
  getByType<
    T extends
      | DocumentTypeEntity
      | SupplierEntity
      | ReceptionTypeEntity
      | ReceptionOriginEntity
      | AnalysisTypeEntity
      | CityEntity
      | DepartmentEntity,
  >(
    type: CatalogTypeEnum,
  ): Promise<T[]>;

  getDocumentTypes(): Promise<DocumentTypeEntity[]>;
  getSuppliers(): Promise<SupplierEntity[]>;
  getReceptionTypes(): Promise<ReceptionTypeEntity[]>;
  getReceptionOrigins(): Promise<ReceptionOriginEntity[]>;
  getAnalysisTypes(): Promise<AnalysisTypeEntity[]>;
  getCities(): Promise<CityEntity[]>;
  getDepartments(): Promise<DepartmentEntity[]>;
}
