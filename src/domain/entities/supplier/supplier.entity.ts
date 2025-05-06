import { DocumentType } from '@prisma/client';

export interface ISupplierEntity {
  id?: string;
  name: string;
  shortName?: string;
  documentTypeId: string;
  verificationDigit?: number | null;
  documentNumber: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
