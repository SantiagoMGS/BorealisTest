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

export interface ISuppliersAssignmentResult {
  successful: {
    supplierId: string;
    success: boolean;
  }[];
  failed: {
    supplierId: string;
    reason: string;
  }[];
  allFailed: boolean;
}
