export interface IReceptionResponse {
  id: string;
  receptionDate: Date;
  batchNumber?: string;
  observation?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  company?: any;
  supplier?: any;
  receptionType?: any;
  receptionOrigin?: any;
  miningTitle?: any;
  city?: any;
  samples?: any[];
}
