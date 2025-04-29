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
}

/**
 * Entidad de dominio para recepción
 */
export interface IReceptionEntity {
  companyId: string;
  supplierId: string;
  receptionTypeId: string;
  receptionDate: Date;
  batchNumber?: string;
  observation?: string;
  Samples: ISampleEntity[];
}

/**
 * Entidad de dominio para recepción de doré
 */
export interface IDoreReceptionEntity {
  companyId: string;
  supplierId: string;
  receptionTypeId: string;
  receptionOriginId: string;
  receptionDate?: Date;
  batchNumber?: string;
  observation?: string;
  items: IDoreEntity[];
}
