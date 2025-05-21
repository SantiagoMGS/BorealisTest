export interface IDoreReceptionResponse {
  id: string;
  companyId: string;
  supplierId: string;
  receptionTypeId: string;
  receptionOriginId: string;
  receptionDate: Date;
  batchNumber?: string | null;
  observation?: string | null;
  cityId?: string | null;
  miningTitleId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  company?: {
    id: string;
    name: string;
    shortName: string;
  };
  supplier?: {
    id: string;
    name: string;
  };
  receptionType?: {
    id: string;
    name: string;
  };
  receptionOrigin?: {
    id: string;
    name: string;
  };

  dores: Array<{
    id?: string;
    code?: number;
    receivedWeight: number | any;
    observation: string | null;
    base64: string | null;
    format: string;
  }>;
}
