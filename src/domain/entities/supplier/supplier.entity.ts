import { DocumentType } from '@prisma/client';

export interface ISupplierEntity {
  id?: string;
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
