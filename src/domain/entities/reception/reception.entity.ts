/**
 * Entidad de dominio para unidad de recepción
 */
export interface IReceptionUnitEntity {
  receptionOriginId: string;
  recievedWeight: number;
  dryWeight: number;
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
  receptionUnits: IReceptionUnitEntity[];
}
