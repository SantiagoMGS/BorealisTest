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

/**
 * Interfaz para operaciones de lectura de catálogos
 */
export interface ICatalogReadRepository {
  getByType<
    T extends
      | DocumentTypeEntity
      | SupplierEntity
      | ReceptionTypeEntity
      | AnalysisTypeEntity
      | CityEntity
      | DepartmentEntity
      | DoreReceptionTypeEntity,
  >(
    type: CatalogTypeEnum,
  ): Promise<T[]>;

  getDocumentTypes(): Promise<DocumentTypeEntity[]>;
  getSuppliers(): Promise<SupplierEntity[]>;
  getReceptionTypes(): Promise<ReceptionTypeEntity[]>;
  getAnalysisTypes(): Promise<AnalysisTypeEntity[]>;
  getCities(): Promise<CityEntity[]>;
  getDepartments(): Promise<DepartmentEntity[]>;
  getDoreReceptionTypes(): Promise<DoreReceptionTypeEntity[]>;
}
