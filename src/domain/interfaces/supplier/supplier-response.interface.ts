import { DocumentType } from '@prisma/client';

export interface ISupplierResponse {
  id: string;
  name: string;
  documentType: DocumentType;
  documentNumber: string;
}
