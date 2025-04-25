import { Injectable } from '@nestjs/common';
import { ICatalogReadRepository } from '@domain/repositories/catalog';
import {
  CatalogTypeEnum,
  DocumentTypeEntity,
  SupplierEntity,
  ReceptionTypeEntity,
  ReceptionOriginEntity,
  AnalysisTypeEntity,
} from '@domain/entities/catalog/catalog.entity';
import { CatalogDatasource } from '@infrastructure/datasource/catalog';

@Injectable()
export class CatalogRepositoryImpl implements ICatalogReadRepository {
  constructor(private readonly catalogDatasource: CatalogDatasource) {}

  /**
   * Obtiene elementos de catálogo según su tipo
   */
  async getByType<
    T extends
      | DocumentTypeEntity
      | SupplierEntity
      | ReceptionTypeEntity
      | ReceptionOriginEntity
      | AnalysisTypeEntity,
  >(type: CatalogTypeEnum): Promise<T[]> {
    switch (type) {
      case CatalogTypeEnum.DOCUMENT_TYPES:
        return this.getDocumentTypes() as Promise<T[]>;
      case CatalogTypeEnum.SUPPLIERS:
        return this.getSuppliers() as Promise<T[]>;
      case CatalogTypeEnum.RECEPTION_TYPES:
        return this.getReceptionTypes() as Promise<T[]>;
      case CatalogTypeEnum.RECEPTION_ORIGINS:
        return this.getReceptionOrigins() as Promise<T[]>;
      case CatalogTypeEnum.ANALYSIS_TYPES:
        return this.getAnalysisTypes() as Promise<T[]>;
      default:
        return [] as T[];
    }
  }

  async getDocumentTypes(): Promise<DocumentTypeEntity[]> {
    const documentTypes = await this.catalogDatasource.getDocumentTypes();
    return documentTypes as DocumentTypeEntity[];
  }

  async getSuppliers(): Promise<SupplierEntity[]> {
    const suppliers = await this.catalogDatasource.getSuppliers();
    return suppliers as SupplierEntity[];
  }

  async getReceptionTypes(): Promise<ReceptionTypeEntity[]> {
    const receptionTypes = await this.catalogDatasource.getReceptionTypes();
    return receptionTypes as ReceptionTypeEntity[];
  }

  async getReceptionOrigins(): Promise<ReceptionOriginEntity[]> {
    const receptionOrigins = await this.catalogDatasource.getReceptionOrigins();
    return receptionOrigins as ReceptionOriginEntity[];
  }

  async getAnalysisTypes(): Promise<AnalysisTypeEntity[]> {
    const analysisTypes = await this.catalogDatasource.getAnalysisTypes();
    return analysisTypes as AnalysisTypeEntity[];
  }
}
