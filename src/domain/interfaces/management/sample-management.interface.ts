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
