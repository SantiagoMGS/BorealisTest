/**
 * Tipos de catálogos disponibles en el sistema
 */
export enum CatalogTypeEnum {
  DOCUMENT_TYPES = 'DOCUMENT_TYPES',
  SUPPLIERS = 'SUPPLIERS',
  RECEPTION_TYPES = 'RECEPTION_TYPES',
  RECEPTION_ORIGINS = 'RECEPTION_ORIGINS',
  ANALYSIS_TYPES = 'ANALYSIS_TYPES',
}

/**
 * Entidad base para cualquier elemento de catálogo
 */
export interface CatalogItem {
  id: string;
  name: string;
  [key: string]: any;
}

/**
 * Entidad para tipos de documento
 */
export interface DocumentTypeEntity extends CatalogItem {
  code: string;
}

/**
 * Entidad para proveedores
 */
export interface SupplierEntity extends CatalogItem {
  documentTypeId: string;
  documentNumber: string;
}

/**
 * Entidad para tipos de recepción
 */
export interface ReceptionTypeEntity extends CatalogItem {
  description?: string;
}

/**
 * Entidad para orígenes de recepción
 */
export interface ReceptionOriginEntity extends CatalogItem {
  description?: string;
}

/**
 * Entidad para tipos de análisis
 */
export interface AnalysisTypeEntity extends CatalogItem {
  description?: string;
}
