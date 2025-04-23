import { DocumentType } from '@prisma/client';

export interface ISupplierResponse {
  id: string;
  name: string;
  documentTypeId: string;
  documentType?: {
    id: string;
    name: string;
    code: string;
  };
  documentNumber: string;
  isActive?: boolean;
}
