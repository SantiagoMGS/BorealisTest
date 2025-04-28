export enum CatalogTypeEnum {
  DOCUMENT_TYPES = 'DOCUMENT_TYPES',
  SUPPLIERS = 'SUPPLIERS',
  RECEPTION_TYPES = 'RECEPTION_TYPES',
  ANALYSIS_TYPES = 'ANALYSIS_TYPES',
  CITIES = 'CITIES',
  DEPARTMENTS = 'DEPARTMENTS',
  DORE_RECEPTION_TYPES = 'DORE_RECEPTION_TYPES',
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

export interface DoreReceptionTypeEntity extends CatalogItem {
  description?: string;
}
