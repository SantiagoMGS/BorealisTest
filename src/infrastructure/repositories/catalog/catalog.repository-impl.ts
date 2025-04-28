import { Injectable } from '@nestjs/common';
import { ICatalogReadRepository } from '@domain/repositories/catalog';
import {
  CatalogTypeEnum,
  DocumentTypeEntity,
  SupplierEntity,
  ReceptionTypeEntity,
  AnalysisTypeEntity,
  CityEntity,
  DepartmentEntity,
  DoreReceptionTypeEntity,
  SampleReceptionTypeEntity,
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
      | AnalysisTypeEntity
      | CityEntity
      | DepartmentEntity
      | DoreReceptionTypeEntity
      | SampleReceptionTypeEntity,
  >(type: CatalogTypeEnum): Promise<T[]> {
    switch (type) {
      case CatalogTypeEnum.DOCUMENT_TYPES:
        return this.getDocumentTypes() as Promise<T[]>;
      case CatalogTypeEnum.SUPPLIERS:
        return this.getSuppliers() as Promise<T[]>;
      case CatalogTypeEnum.RECEPTION_TYPES:
        return this.getReceptionTypes() as Promise<T[]>;
      case CatalogTypeEnum.ANALYSIS_TYPES:
        return this.getAnalysisTypes() as Promise<T[]>;
      case CatalogTypeEnum.CITIES:
        return this.getCities() as Promise<T[]>;
      case CatalogTypeEnum.DEPARTMENTS:
        return this.getDepartments() as Promise<T[]>;
      case CatalogTypeEnum.DORE_RECEPTION_TYPES:
        return this.getDoreReceptionTypes() as Promise<T[]>;
      case CatalogTypeEnum.SAMPLE_RECEPTION_TYPES:
        return this.getSampleReceptionTypes() as Promise<T[]>;
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

  async getAnalysisTypes(): Promise<AnalysisTypeEntity[]> {
    const analysisTypes = await this.catalogDatasource.getAnalysisTypes();
    return analysisTypes as AnalysisTypeEntity[];
  }

  async getCities(): Promise<CityEntity[]> {
    const cities = await this.catalogDatasource.getCities();
    return cities.map((city) => ({
      ...city,
      code: city.daneCode,
    })) as CityEntity[];
  }

  async getDepartments(): Promise<DepartmentEntity[]> {
    const departments = await this.catalogDatasource.getDepartments();
    return departments.map((department) => ({
      ...department,
      code: department.daneCode,
    })) as DepartmentEntity[];
  }

  async getDoreReceptionTypes(): Promise<DoreReceptionTypeEntity[]> {
    const doreReceptionTypes =
      await this.catalogDatasource.getDoreReceptionTypes();
    return doreReceptionTypes as DoreReceptionTypeEntity[];
  }

  async getSampleReceptionTypes(): Promise<SampleReceptionTypeEntity[]> {
    const sampleReceptionTypes =
      await this.catalogDatasource.getSampleReceptionTypes();
    return sampleReceptionTypes as SampleReceptionTypeEntity[];
  }
}
