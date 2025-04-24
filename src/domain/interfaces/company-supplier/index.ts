export interface ICompanySupplierResponse {
  company: {
    id: string;
    name: string;
    shortName: string;
  };
  supplier: {
    id: string;
    name: string;
    documentNumber: string;
    verificationDigit: string;
  };
}
