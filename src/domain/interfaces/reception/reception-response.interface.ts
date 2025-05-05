/**
 * Interfaz para la respuesta de operaciones con recepciones
 */
export interface IReceptionResponse {
  id: string;
  receptionDate: Date;
  batchNumber?: string;
  observation?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  company?: any;
  supplier?: any;
  receptionType?: any;
  receptionOrigin?: any;
  miningTitle?: any;
  city?: any;
  Samples?: any[];
}
