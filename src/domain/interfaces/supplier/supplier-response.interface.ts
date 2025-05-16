export interface ISupplierResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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
