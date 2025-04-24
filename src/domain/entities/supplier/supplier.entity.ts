import { DocumentType } from '@prisma/client';

export interface ISupplierEntity {
  id?: string;
  name: string;
  documentTypeId: string;
  verificationDigit: string;
  documentNumber: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
