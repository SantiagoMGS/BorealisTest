export enum CatalogTypeEnum {
  DOCUMENT_TYPES = 'DOCUMENT_TYPES',
  SUPPLIERS = 'SUPPLIERS',
  RECEPTION_TYPES = 'RECEPTION_TYPES',
  RECEPTION_ORIGINS = 'RECEPTION_ORIGINS',
  ANALYSIS_TYPES = 'ANALYSIS_TYPES',
  CITIES = 'CITIES',
  DEPARTMENTS = 'DEPARTMENTS',
}

export interface CatalogItem {
  id: string;
  name: string;
  [key: string]: any;
}

export interface DocumentTypeEntity extends CatalogItem {
  code: string;
}

export interface SupplierEntity extends CatalogItem {
  documentTypeId: string;
  documentNumber: string;
}

export interface ReceptionTypeEntity extends CatalogItem {
  description?: string;
}

export interface ReceptionOriginEntity extends CatalogItem {
  description?: string;
}

export interface AnalysisTypeEntity extends CatalogItem {
  description?: string;
}

export interface DepartmentEntity extends CatalogItem {
  code: string;
  countryId?: string;
}

export interface CityEntity extends CatalogItem {
  code: string;
  departmentId: string;
}
