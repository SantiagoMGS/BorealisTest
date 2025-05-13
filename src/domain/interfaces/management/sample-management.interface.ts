export interface ISupplier {
  id: string;
  name: string;
}

export interface ISample {
  id: string;
  code: number | string;
}

export interface IReceptionOrigin {
  id: string;
  name: string;
}

export interface ISampleDropdownData {
  suppliers: ISupplier[];
  samples: ISample[];
  receptionOrigins: IReceptionOrigin[];
}

export interface ISampleManagementResponse {
  id: string;
  batchNumber: string | null;
  receptionDate: Date;
  samples: Array<{
    id: string;
    code: number | string;
    receivedWeight: number | null | any;
  }>;
  supplier: {
    id: string;
    name: string;
  };
  receptionOrigin: {
    id: string;
    name: string;
  };
}
