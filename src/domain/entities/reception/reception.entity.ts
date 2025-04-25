/**
 * Entidad de dominio para recepción
 */
export interface IReceptionEntity {
  companyId: string;
  supplierId: string;
  receptionTypeId: string;
  receptionOriginId: string;
  receptionDate: Date;
  batchNumber?: string;
  observation?: string;
}
