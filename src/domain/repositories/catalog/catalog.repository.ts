import {
  CatalogTypeEnum,
  DocumentTypeEntity,
  SupplierEntity,
  ReceptionTypeEntity,
  ReceptionOriginEntity,
  AnalysisTypeEntity,
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
      | AnalysisTypeEntity,
  >(
    type: CatalogTypeEnum,
  ): Promise<T[]>;

  getDocumentTypes(): Promise<DocumentTypeEntity[]>;
  getSuppliers(): Promise<SupplierEntity[]>;
  getReceptionTypes(): Promise<ReceptionTypeEntity[]>;
  getReceptionOrigins(): Promise<ReceptionOriginEntity[]>;
  getAnalysisTypes(): Promise<AnalysisTypeEntity[]>;
}
