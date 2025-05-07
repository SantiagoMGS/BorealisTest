/**
 * Entidad de dominio para unidad de recepción
 */
export interface ISampleEntity {
  code?: number;
  receptionOriginId: string;
  receivedWeight: number;
  dryWeight: number;
  analysisTypeIds?: string[];
}

/**
 * Entidad de dominio para doré
 */
export interface IDoreEntity {
  receivedWeight: number;
  observation?: string;
  statusId?: string;
  images: IDoreImageEntity[];
}
export interface IDoreImageEntity {
  format: string;
  base64: string;
}
/**
 * Entidad de dominio para recepción
 */
export interface IReceptionEntity {
  companyId: string;
  supplierId: string;
  receptionDate: Date;
  batchNumber?: string;
  observation?: string;
  miningTitleId?: string;
  cityId?: string;
  Samples: ISampleEntity[];
}

/**
 * Entidad de dominio para recepción de doré
 */
export interface IDoreReceptionEntity {
  companyId: string;
  supplierId: string;
  receptionOriginId: string;
  receptionDate?: Date;
  batchNumber?: string;
  observation?: string;
  miningTitleId?: string;
  cityId: string;
  items: IDoreEntity[];
}
