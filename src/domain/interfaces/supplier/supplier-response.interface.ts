import { DocumentType } from '@prisma/client';

export interface ISupplierResponse {
  id: string;
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
