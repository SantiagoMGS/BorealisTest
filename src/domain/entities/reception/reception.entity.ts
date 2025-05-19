export interface ISampleEntity {
  id?: string;
  code?: string;
  receptionOriginId: string;
  receivedWeight: number;
  analysisTypeIds?: string[];
}

export interface IDoreEntity {
  receivedWeight: number;
  observation?: string;
  statusId?: string;
  images: IDoreImageEntity[];
}
export interface IDoreImageEntity {
  format: string;
  base64: string;
}

export interface IReceptionEntity {
  companyId: string;
  supplierId: string;
  receptionDate: Date;
  batchNumber?: string;
  observation?: string;
  miningTitleId?: string;
  cityId?: string;
  samples: ISampleEntity[];
}

export interface IDoreReceptionEntity {
  companyId: string;
  supplierId: string;
  receptionOriginId: string;
  receptionDate?: Date;
  batchNumber?: string;
  observation?: string;
  miningTitleId?: string;
  cityId: string;
  items: IDoreEntity[];
}
