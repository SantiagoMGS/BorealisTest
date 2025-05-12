export interface IDoreDropdownData {
  suppliers: ISupplier[];
  dores: IDore[];
  batchNumbers: string[];
  receptionOrigins: IReceptionOrigin[];
}
export interface ISupplier {
  id: string;
  name: string;
}

export interface IDore {
  id: string;
  code: number;
}

export interface IReceptionOrigin {
  id: string;
  name: string;
}
