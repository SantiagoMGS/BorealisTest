import { IPaginationOptions } from '@shared/index';

export interface IManagementFilter extends IPaginationOptions {
  startDate: Date;
  endDate: Date;
  supplierIds?: string[];
  receptionOriginIds?: string[];
  doreIds?: string[];
  sampleIds?: string[];
  batchNumbers?: string[];
  isDone?: boolean;
}
