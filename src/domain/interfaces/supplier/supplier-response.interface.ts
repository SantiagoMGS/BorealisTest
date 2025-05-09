import { DocumentType } from '@prisma/client';

export interface ISupplierResponse {
  id: string;
  name: string;
  documentType: {
    id: string;
    name: string;
    code: string;
  };
  documentNumber: string;
  verificationDigit?: number | null;
  shortName: string;
  isActive?: boolean;
}
